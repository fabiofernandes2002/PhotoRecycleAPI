const db = require('../models');
const Ecopoint = db.ecopontos;
const RegistoUtilizacao = db.utilizacoes;
const User = db.utilizadores;

const config = require("../config/db.config.js");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

// Registar um novo ecoponto
exports.createAdicaoEcoponto = async (req, res) => {
  const validacao = User.tipo === "admin" ? true : false;

  let ecoponto_imgage = null;
  if (req.file) {
    ecoponto_imgage = await cloudinary.uploader.upload(req.file.path, {
      folder: "Ecopontos",
      crop: "scale",
    });
  } else{
    return res.status(400).json({
      success: false,
      msg: "Coloque uma foto.",
    });
  }
  

  const adicaoEcoponto = new Ecopoint({
      criador: req.loggedUserId,
      nome: req.body.nome,
      morada: req.body.morada,
      localizacao: req.body.localizacao,
      dataCriacao: req.body.dataCriacao,
      foto: ecoponto_imgage.secure_url,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      tipo: req.body.tipo,
      validacao: validacao,
  });

  // o valor de criador tem de ser igual ao id do utilizador autenticado
  if (req.loggedUserId !== req.params.ecopointID) {
      // passar o id do utilizador autenticado para o id do criador
      adicaoEcoponto.criador = req.loggedUserId;
  } else {
      return res.status(401).json({
          success: false,
          msg: "Tem que estar logado para criar um novo ecoponto."
      });
  }

  try {
      await adicaoEcoponto.save();
      res.status(201).json({
          sucess: true,
          msg: "Novo registo de adição criado com sucesso!",
          URL: `/adicaoEcopontos/${adicaoEcoponto._id}`,
      });
  } catch (err) {
      if (err.name === 'ValidationError') {
          let errors = [];
          Object.keys(err.errors).forEach((key) => {
              errors.push(err.errors[key].message);
          });
          return res.status(400).json({
              success: false,
              msgs: errors
          });
      }
      res.status(500).json({
          success: false,
          msg: err.message || 'Algo deu errado. Por favor, tente novamente mais tarde. ',
      });
  }
}

exports.findAll = async (req, res) => {
  const tipo = req.query.tipo;

  const condition = tipo ? { tipo: new RegExp(tipo, 'i') } : {};
  try {
    // find function parameters: filter, projection (select) / returns a list of documents
    let ecopontos = await Ecopoint.find(condition)
      .select(
        'nome criador localizacao morada dataCriacao foto tipo latitude longitude validacao'
      ) // select the fields: do not show versionKey field
      .exec(); // execute the query
    res.status(200).json({ success: true, ecopontos: ecopontos });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || 'Algo deu errado. Por favor, tente novamente mais tarde.',
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    // findById(id) === findOne( {_id : id })
    const ecopoint = await Ecopoint.findById(req.params.ecopointID).exec();

    if (ecopoint === null)
      return res.status(404).json({
        success: false,
        msg: `Não foi possível encontrar o ecoponto como o ID: ${req.params.ecopointID}.`,
      });
    res.status(200).json({
      success: false,
      ecoponto: ecopoint,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'Algo deu errado. Por favor, tente novamente mais tarde.',
    });
  }
};

// Function to use the Ecopoint model
exports.useEcopoint = async (req, res) => {
  try {
    const ecopointID = req.params.id;

    const ecopoint = await Ecopoint.findById(ecopointID).exec();

    let image_utilizacao = null;
    if (req.file) {
      image_utilizacao = await cloudinary.uploader.upload(req.file.path, {
        folder: 'utilizacoes',
        crop: 'scale',
      })
    }

    // usar registo de utilização para guardar o idUtilizador, idEcoponto, dataUtilizacao, foto, validacao
    const registoUtilizacao = new RegistoUtilizacao({
      idUtilizador: req.loggedUserID,
      idEcoponto: ecopointID,
      dataUtilizacao: Date.now(),
      foto: image_utilizacao.secure_url,
      validacao: false,
    });

    // save the registoUtilizacao in the database
    await registoUtilizacao.save();

    if (!ecopoint) {
      return res.status(404).json({
        success: false,
        msg: `Não foi possível encontrar o ecoponto com o ID: ${ecopointID}.`,
      });
    }
    res.status(200).json({
      success: true,
      ecoponto: ecopoint,
      /* falta adicionar a utilização do ecoponto pelo utilizador */
      msg: `O ecoponto com o ID: ${ecopointID} foi utilizado com sucesso.`,
    });
 
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'Algo deu errado. Por favor, tente novamente mais tarde.',
    });
  }
};

// validar ecoponto passando a validacao para true mas só se o utilizador estiver autenticado e for admin
exports.validateEcopoint = async (req, res) => {
  if (req.loggedUserType != 'admin') {
    return res.status(403).json({
        success: false,
        msg: 'Apenas o administrador pode aceder a esta funcionalidade!',
    });
  }

  try {
    const ecopoint = await Ecopoint.findByIdAndUpdate(req.params.ecopointID, { validacao: true }, { new: true, useFindAndModify: false });
    if (!ecopoint) {
        return res.status(404).json({
            success: false,
            msg: `Não foi possível encontrar o ecoponto com o ID: ${req.params.ecopointID}.`,
        });
    }
    res.status(200).json({
        success: true,
        msg: `O ecoponto com o ID: ${req.params.ecopointID} foi validado com sucesso!`,
    });

    // atribuir pontos ao utilizador
    const utilizador = await User.findById(ecopoint.criador).exec();
    utilizador.pontos += 50;
    // guardar o utilizador na base de dados
    await utilizador.save();
    res.status(200).json({
      success: true,
      msg: `Foram atribuídos 10 pontos ao utilizador com o ID: ${ecopoint.criador}.`,
    });

  } catch (err) {
    res.status(500).json({
        success: false,
        msg: err.message || 'Algo deu errado. Por favor, tente novamente mais tarde.',
    });
  }
};

exports.deleteEcopontoById = async (req, res) => {
  try {
    if (req.loggedUserType != 'admin') {
      return res.status(403).json({
        success: false,
        msg: 'Apenas o administrador pode aceder a esta funcionalidade!',
      });
    }

    const ecopoint = await Ecopoint.findByIdAndDelete(req.params.id).exec();

    if (ecopoint === null)
      return res.status(404).json({
        success: false,
        msg: `Não foi possível encontrar o ecoponto com o ID: ${req.params.id}.`,
      });
    res.status(200).json({
      success: true,
      msg: `Ecoponto com o ID: ${req.params.id} foi eliminado com sucesso.`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'Algo deu errado. Por favor, tente novamente mais tarde.',
    });
  }
};

