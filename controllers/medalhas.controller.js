const db = require("../models");
const Medalha = db.medalhas;

// Create and Save a new Medalha
exports.createMedalha = async (req, res) => {
    const medalha = new Medalha({
        nomeMedalha: req.body.nomeMedalha,
        urlMedalha: req.body.urlMedalha,
        pontos: req.body.pontos,
    });

    try {
        await medalha.save();
        res.status(201).json({
            sucess: true,
            msg: "Nova medalha criada com sucesso!",
            URL: `/medalhas/${medalha._id}`
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

// Retrieve all Medalhas from the database.
exports.findAllMedalhas = async (req, res) => {
    const nomeMedalha = req.query.nomeMedalha;
    const condition = nomeMedalha ? {
        nomeMedalha: {
            new: RegExp(nomeMedalha, "i"),
        }
    } : {};
    
    try {
        const data = await Medalha.find(condition).
        select('nomeMedalha urlMedalha pontos').
        exec();
        res.status(200).json({
            success: true,
            medalhas: data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || 'Algo deu errado. Por favor, tente novamente mais tarde. ',
        });
    }
}

// Find a single Medalha with an id
exports.findOneMedalha = async (req, res) => {
    const idMedalha = req.params.idMedalha;

    try {
        const data = await Medalha.findById(idMedalha).
        select('nomeMedalha urlMedalha pontos').
        exec();
        if (!data)
            res.status(404).json({
                success: false,
                msg: "Medalha não encontrada!"
            });
        else res.status(200).json({
            success: true,
            medalha: data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || 'Algo deu errado. Por favor, tente novamente mais tarde. ',
        });
    }
}

// Update a Medalha by the id in the request
exports.updateMedalha = async (req, res) => {
    const idMedalha = req.params.idMedalha;
    const dados = req.body;

    try {
        const data = await Medalha.findByIdAndUpdate(idMedalha, dados, {
            new: true,
            runValidators: true
        });

        if (!data)
            return res.status(404).json({
                success: false,
                msg: "Medalha não encontrada!"
            });
        else res.status(200).json({
            success: true,
            msg: "Medalha atualizado com sucesso!",
            URL: `/medalha/${idMedalha}`
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

// delete medalha
exports.deleteMedalha = async (req, res) => {
    const idMedalha = req.params.idMedalha;

    try {
        const data = await Medalha.findByIdAndRemove(idMedalha);
        if (!data)
            return res.status(404).json({
                success: false,
                msg: "Medalha não encontrada!"
            });
        else res.status(200).json({
            success: true,
            msg: "Medalha eliminada com sucesso!"
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || 'Algo deu errado. Por favor, tente novamente mais tarde. ',
        });
    }
}