const db = require("../models");
const RegistoUtilizacao = db.utilizacoes;
const User = db.utilizadores;

const config = require("../config/db.config.js");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
});

// Retrieve all RegistoUtilizacaos from the database.
exports.findAllRegistoUtilizacoes = async (req, res) => {
    const idUtilizador = req.query.idUtilizador;
    const condition = idUtilizador
        ? {
            idUtilizador: {
                $regex: new RegExp(idUtilizador),
                $options: 'i',
            },
        }
        : {};

    try {
        if (req.loggedUserType != 'admin') {
            return res.status(403).json({
                success: false,
                msg: 'Apenas o administrador pode aceder a esta funcionalidade!',
            });
        }
        const registoUtilizacao = await RegistoUtilizacao.find(condition).
            select('idUtilizador idEcoponto dataUtilizacao foto validacao').
            exec();
        res.status(200).json({
            success: true,
            registoUtilizacao: registoUtilizacao,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || 'Algo deu errado. Por favor, tente novamente mais tarde. ',
        });
    }
}

// create utilizaco
exports.createUtilizacao = async (req, res) => {

    try {
        const ecopointID = req.body.idEcoponto;

        let utilizacao = await RegistoUtilizacao.findById(ecopointID);

        let image_utilizacao = null;
        if (req.file) {
            image_utilizacao = await cloudinary.uploader.upload(req.file.path, {
                folder: "Utilizacões",
                crop: "scale",
            });
        } else {
            return res.status(400).json({
                success: false,
                msg: "Coloque uma foto.",
            });
        }

        const registoUtilizacao = new RegistoUtilizacao({
            idUtilizador: req.loggedUserID,
            idEcoponto: ecopointID,
            dataUtilizacao: Date.now(),
            foto: image_utilizacao.secure_url,
            validacao: false,
        });

        // save the registoUtilizacao in the database
        await registoUtilizacao.save();

        if (!utilizacao) {
            return res.status(404).json({
                success: false,
                msg: `Não foi possível encontrar o ecoponto com o ID: ${ecopointID}.`,
            });
        }
        res.status(201).json({
            success: true,
            ecoponto: utilizacao,
            /* falta adicionar a utilização do ecoponto pelo utilizador */
            msg: `O ecoponto com o ID: ${ecopointID} foi utilizado com sucesso.`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Algo deu errado. Por favor, tente novamente mais tarde.',
        });
    }


}

// list all registoUtilizacoes from the database is validation == true.
exports.findAllRegistoUtilizacoesValidados = async (req, res) => {
    try {
        if (req.loggedUserType != 'admin') {
            return res.status(403).json({
                success: false,
                msg: 'Apenas o administrador pode aceder a esta funcionalidade!',
            });
        }

        const data = await RegistoUtilizacao.find({
            validacao: true
        }).
            select('idUtilizador idEcoponto dataUtilizacao foto validacao').
            exec();
        res.status(200).json({
            success: true,
            registoUtilizacoes: data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || 'Algo deu errado. Por favor, tente novamente mais tarde. ',
        });
    }
}

// list all registoUtilizacoes from the database is validation == false.
exports.findAllRegistoUtilizacoesNaoValidados = async (req, res) => {
    try {
        if (req.loggedUserType != 'admin') {
            return res.status(403).json({
                success: false,
                msg: 'Apenas o administrador pode aceder a esta funcionalidade!',
            });
        }

        const data = await RegistoUtilizacao.find({
            validacao: false
        }).
            select('idUtilizador idEcoponto dataUtilizacao foto validacao').
            exec();
        res.status(200).json({
            success: true,
            registoUtilizacoes: data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || 'Algo deu errado. Por favor, tente novamente mais tarde. ',
        });
    }
}

// Find a single RegistoUtilizacao with an id
exports.findOneRegistoUtilizacao = async (req, res) => {
    const idRegistoUtilizacao = req.params.idRegistoUtilizacao;

    try {
        if (req.loggedUserType != 'admin') {
            return res.status(403).json({
                success: false,
                msg: 'Apenas o administrador pode aceder a esta funcionalidade!',
            });
        }
        const data = await RegistoUtilizacao.findById(idRegistoUtilizacao).
            select('idUtilizador idEcoponto dataUtilizacao foto validacao').
            exec();
        if (!data)
            return res.status(404).json({
                success: false,
                msg: "Registo de utilização não encontrado!"
            });
        else res.status(200).json({
            success: true,
            registoUtilizacao: data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || 'Algo deu errado. Por favor, tente novamente mais tarde. ',
        });
    }
};

// Delete a RegistoUtilizacao with the specified id in the request
exports.deleteRegistoUtilizacao = async (req, res) => {
    const idRegistoUtilizacao = req.params.idRegistoUtilizacao;

    try {
        if (req.loggedUserType != 'admin') {
            return res.status(403).json({
                success: false,
                msg: 'Apenas o administrador pode aceder a esta funcionalidade!',
            });
        }

        const data = await RegistoUtilizacao.findByIdAndRemove(idRegistoUtilizacao);
        if (!data)
            return res.status(404).json({
                success: false,
                msg: "Registo de utilização não encontrado!"
            });
        else res.status(200).json({
            success: true,
            msg: "Registo de utilização eliminado com sucesso!"
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || 'Algo deu errado. Por favor, tente novamente mais tarde. ',
        });
    }
};

// validadr a utilização de um ecoponto por admin quando estiver logado passando a validação para true
exports.validarRegistoUtilizacao = async (req, res) => {
    const idRegistoUtilizacao = req.params.idRegistoUtilizacao;
    const registoUtilizacao = req.body;

    try {
        if (req.loggedUserType != 'admin') {
            return res.status(403).json({
                success: false,
                msg: 'Apenas o administrador pode aceder a esta funcionalidade!',
            });
        }
        const data = await RegistoUtilizacao.findByIdAndUpdate(idRegistoUtilizacao, registoUtilizacao, {
            new: true,
            runValidators: true,
        });
        if (!data)
            return res.status(404).json({
                success: false,
                msg: 'Registo de utilização não encontrado!',
            });
        else
            res.status(200).json({
                success: true,
                msg: 'Utilização do ecoponto validada co sucesso!',
                URL: `/registoUtilizacoes/${idRegistoUtilizacao}`,
            });

        // atribuir pontos ao utilizador que fez a utilização do ecoponto
        const utilizador = await User.findById(data.idUtilizador);
        const pontos = utilizador.pontos + 10;
        utilizador.pontos = pontos;
        await User.findByIdAndUpdate(data.idUtilizador, utilizador, {
            new: true,
            runValidators: true,
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            let errors = [];
            Object.keys(err.errors).forEach((key) => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({
                success: false,
                msgs: errors,
            });
        }
        res.status(500).json({
            success: false,
            msg: err.message || 'Algo deu errado. Por favor, tente novamente mais tarde. ',
        });
    }
};
