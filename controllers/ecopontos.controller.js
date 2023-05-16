const db = require('../models');
const Ecopoint = db.ecopontos;

exports.findAll = async (req, res) => {
  const tipo = req.query.tipo;

  const condition = tipo ? { tipo: new RegExp(tipo, 'i') } : {};
  try {
    // find function parameters: filter, projection (select) / returns a list of documents
    let data = await Ecopoint.find(condition)
      .select(
        'nome criador localizacao morada dataCriacao estado tipo latitude longitude valicacao'
      ) // select the fields: do not show versionKey field
      .exec(); // execute the query
    res.status(200).json({ success: true, ecopoints: data });
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
    const ecopointID = req.params.ecopointID;

    const ecopoint = await Ecopoint.findById(ecopointID).exec();

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
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'Algo deu errado. Por favor, tente novamente mais tarde.',
    });
  }
};

exports.delete = async (req, res) => {
  try {
    if (req.loggedUserType != 'admin') {
      return res.status(403).json({
        success: false,
        msg: 'Apenas o administrador pode aceder a esta funcionalidade!',
      });
    }

    const ecopointID = req.params.ecopointID;
    const ecopoint = await Ecopoint.findById(ecopointID).exec();

    if (ecopoint === null)
      return res.status(404).json({
        success: false,
        msg: `Não foi possível encontrar o ecoponto com o ID: ${req.params.ecopointID}.`,
      });
    res.status(200).json({
      success: true,
      msg: `Ecoponto com o ID: ${req.params.ecopointID} foi eliminado com sucesso.`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'Algo deu errado. Por favor, tente novamente mais tarde.',
    });
  }
};
