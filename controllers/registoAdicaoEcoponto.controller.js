const db = require("../models");
const AdicaoEcoponto = db.adicaoEcoponto;

// Create and Save a new AdicaoEcoponto
exports.createAdicaoEcoponto = async (req, res) => {
    const adicaoEcoponto = new AdicaoEcoponto({
        foto: req.body.foto,
        idUtilizador: req.body.idUtilizador,
        morada: req.body.morada,
        codigoPostal: req.body.codigoPostal,
        descricao: req.body.descricao,
        comentario: req.body.comentario,
        dataCriacao: req.body.dataCriacao,
        validacao: req.body.validacao,
    });

    try {
        await adicaoEcoponto.save();
        res.status(201).json({
            sucess: true,
            msg: "Novo ecoponto criado com sucesso!",
            URL: `/adicaoEcopontos/${adicaoEcoponto._id}`
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

// Retrieve all AdicaoEcopontos from the database.
exports.findAllAdicaoEcopontos = async (req, res) => {
    const idUtilizador = req.query.idUtilizador;
    const condition = idUtilizador ? {
        idUtilizador: {
            new: RegExp(idUtilizador, "i")
        }
    } : {};

    try {
        const data = await AdicaoEcoponto.find(condition).
        select('foto idUtilizador morada codigoPostal descricao comentario dataCriacao validacao').
        exec();
        res.status(200).json({
            success: true,
            adicaoEcopontos: data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao tentar recuperar os ecopontos."
        });
    }
}

// Find a single AdicaoEcoponto with an id
exports.findOneAdicaoEcoponto = async (req, res) => {
    const idAdicaoEcoponto = req.params.idAdicaoEcoponto;

    try {
        const data = await AdicaoEcoponto.findById(idAdicaoEcoponto).
        select('foto idUtilizador morada codigoPostal descricao comentario dataCriacao validacao').
        exec();
        if (!data)
            res.status(404).json({
                success: false,
                msg: `Não foi encontrado nenhum ecoponto com o id ${idAdicaoEcoponto}`
            });
        else res.status(200).json({
            success: true,
            adicaoEcoponto: data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: `Erro ao tentar encontrar o ecoponto com o id ${idAdicaoEcoponto}`
        });
    }
}

// delete a AdicaoEcoponto with the specified id in the request
exports.deleteAdicaoEcoponto = async (req, res) => {
    const idAdicaoEcoponto = req.params.idAdicaoEcoponto;

    try {
        const data = await AdicaoEcoponto.findByIdAndRemove(idAdicaoEcoponto);
        if (!data)
            res.status(404).json({
                success: false,
                msg: `Não foi encontrado nenhum ecoponto com o id ${idAdicaoEcoponto}`
            });
        else res.status(200).json({
            success: true,
            msg: `Ecoponto com o id ${idAdicaoEcoponto} eliminado com sucesso!`
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: `Erro ao tentar eliminar o ecoponto com o id ${idAdicaoEcoponto}`
        });
    }
}

// fazer a validação de um ecoponto adicionado por um utilizador passando a validacao para true
exports.validarAdicaoEcoponto = async (req, res) => {
    const idAdicaoEcoponto = req.params.idAdicaoEcoponto;

    try {
        const data = await AdicaoEcoponto.findByIdAndUpdate(idAdicaoEcoponto, {
            validacao: true
        }, {
            new: true,
            useFindAndModify: false
        });
        if (!data)
            res.status(404).json({
                success: false,
                msg: `Não foi encontrado nenhum ecoponto com o id ${idAdicaoEcoponto}`
            });
        else res.status(200).json({
            success: true,
            msg: `Ecoponto com o id ${idAdicaoEcoponto} validado com sucesso!`
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: `Erro ao tentar validar o ecoponto com o id ${idAdicaoEcoponto}`
        });
    }
}