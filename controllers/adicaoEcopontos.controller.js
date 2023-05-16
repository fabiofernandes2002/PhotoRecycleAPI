const db = require('../models');
const AdicaoEcoponto = db.adicaoecopontos;
const RegistoAdicaoEcoponto = db.registoadicaoecoponto;

// Create and Save a new AdicaoEcoponto mas só se o utilizador estiver autenticado
exports.createAdicaoEcoponto = async (req, res) => {
    const adicaoEcoponto = new AdicaoEcoponto({
        morada: req.body.morada,
        localizacao: req.body.localizacao,
        dataCriacao: req.body.dataCriacao,
        foto: req.body.foto,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        tipo: req.body.tipo,
        validacao: req.body.validacao,
    });

    // o valor de criador tem de ser igual ao id do utilizador autenticado
    if (req.loggedUserId !== req.params.id ) { 
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
            URL: `/adicaoEcopontos/${adicaoEcoponto._id}`
        });
        // adicionar novo ecoponto criado ao registoAdicaoEcoponto
        const registoAdicaoEcoponto = new RegistoAdicaoEcoponto({
            criador: req.loggedUserId,
            morada: req.body.morada,
            localizacao: req.body.localizacao,
            dataCriacao: req.body.dataCriacao,
            foto: req.body.foto,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            tipo: req.body.tipo,
            validacao: req.body.validacao,

        });
        await registoAdicaoEcoponto.save();
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

// Retrieve all RegistoAdicaoEcopontos from the database.
exports.findAllRegistoAdicaoEcopontos = async (req, res) => {
    const idUtilizador = req.query.idUtilizador;
    const condition = idUtilizador ? {
        idUtilizador: {
            new: RegExp(idUtilizador, "i")
        }
    } : {};

    try {
        const data = await RegistoAdicaoEcoponto.find(condition).
        select('foto criador localizacao morada tipo latitude longitude dataCriacao validacao').
        exec();
        res.status(200).json({
            success: true,
            adicaoEcopontos: data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || 'Algo deu errado. Por favor, tente novamente mais tarde. ',
        });
    }
}

// validar ecoponto passando a validacao para true mas só se o utilizador estiver autenticado e for admin
exports.validarRegistoAdicaoEcoponto = async (req, res) => {
    const idRegistoAdicaoEcoponto = req.params.id;

    try {

        if (req.loggedUserType != 'admin') {
            return res.status(403).json({
                success: false,
                msg: 'Apenas o administrador pode aceder a esta funcionalidade!',
            });
        }

        const data = await RegistoAdicaoEcoponto.findByIdAndUpdate(idRegistoAdicaoEcoponto, {
            validacao: true
        }, {
            new: true,
            useFindAndModify: false
        });
        if (!data) {
            return res.status(404).json({
                success: false,
                msg: `Não foi encontrado nenhum ecoponto com o id ${idRegistoAdicaoEcoponto}.`
            });
        } else {
            res.status(200).json({
                success: true,
                msg: `Ecoponto com o id ${idRegistoAdicaoEcoponto} validado com sucesso!`
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || `Algo deu errado ao validar o ecoponto com o id ${idRegistoAdicaoEcoponto}.`
        });
    }
}