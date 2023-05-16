const db = require("../models");
const RegistoUtilizacao = db.registoutilizacaos;

// Create and Save a new RegistoUtilizacao
/* exports.createRegistoUtilizacao = async (req, res) => {
    const registoUtilizacao = new RegistoUtilizacao({
        idUtilizador: req.body.idUtilizador,
        idEcoponto: req.body.idEcoponto,
        dataUtilizacao: req.body.dataUtilizacao,
        foto: req.body.foto,
        dataCriacao: req.body.dataCriacao,
        validacao: req.body.validacao,
    });

    try {
        await registoUtilizacao.save();
        res.status(201).json({
            sucess: true,
            msg: "Novo registo de utilização criado com sucesso!",
            URL: `/registoUtilizacoes/${registoUtilizacao._id}`
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
} */

// Retrieve all RegistoUtilizacaos from the database.
exports.findAllRegistoUtilizacoes = async (req, res) => {
    const idUtilizador = req.query.idUtilizador;
    const condition = idUtilizador ? {
        idUtilizador: {
            $regex: new RegExp(idUtilizador),
            $options: "i"
        }
    } : {};

    try {
        if (req.loggedUserType != 'admin') {
            return res.status(403).json({
                success: false,
                msg: 'Apenas o administrador pode aceder a esta funcionalidade!',
            });
        }
        const data = await RegistoUtilizacao.find(condition).
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
}

// Update a RegistoUtilizacao by the id in the request
/* exports.updateRegistoUtilizacao = async (req, res) => {
   
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
            runValidators: true
        });
        if (!data)
            return res.status(404).json({
                success: false,
                msg: "Registo de utilização não encontrado!"
            });
        else res.status(200).json({
            success: true,
            msg: "Registo de utilização atualizado com sucesso!",
            URL: `/registoUtilizacoes/${idRegistoUtilizacao}`
        });
    }
    catch (err) {
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
} */

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
            runValidators: true
        });
        if (!data)
            return res.status(404).json({
                success: false,
                msg: "Registo de utilização não encontrado!"
            });
        else res.status(200).json({
            success: true,
            msg: "Utilização do ecoponto validada co sucesso.!",
            URL: `/registoUtilizacoes/${idRegistoUtilizacao}`
        });
    }
    catch (err) {
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


