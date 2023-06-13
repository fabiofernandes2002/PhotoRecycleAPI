const db = require("../models");
const Desafio = db.desafios;

// Retrieve all Desafios from the database.
exports.findAllDesafios = async (req, res) => {

    const nome = req.query.nome;
    const condition = nome ? {
        nome: new RegExp(nome, 'i')
    } : {};

    try {
        let data = await Desafio.find(condition)
            .select('nome descricao recompensa')
            .exec();
        res.status(200).json({
            success: true,
            desafios: data
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            msg: err.message || 'Algo deu errado. Por favor, tente novamente mais tarde.'
        });
    }
}

// Create and Save a new Desafio
exports.createDesafio = async (req, res) => {
    const desafio = new Desafio({
        nome: req.body.nome,
        descricao: req.body.descricao,
        recompensa: req.body.recompensa,
    });

    // Verificar se o desafio já existe
    const desafioExiste = await Desafio.findOne({
        nome: req.body.nome
    });
    if (desafioExiste) {
        return res.status(400).json({
            success: false,
            msg: `O desafio ${req.body.nome} já existe!`
        });
    }

    try {
        if (req.loggedUserType != 'admin') {
            return res.status(403).json({
                success: false,
                msg: 'Apenas o administrador pode aceder a esta funcionalidade!',
            });
        }

        await desafio.save();
        res.status(201).json({
            sucess: true,
            msg: "Novo desafio criado com sucesso!",
            URL: `/desafios/${desafio._id}`
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
};

// Find a single Desafio with an id
exports.findOneDesafio = async (req, res) => {
    const idDesafio = req.params.idDesafio;

    try {
        const desafio = await Desafio.findById(idDesafio).
        select('nome descricao recompensa').
        exec();
        if (desafio === null) {
            return res.status(404).json({
                success: false,
                msg: `Desafio com o id ${idDesafio} não encontrado!`,
            });
        }
        res.status(200).json({
            success: true,
            desafio: desafio
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            msg: `Erro ao obter o desafio com o id ${idDesafio}!`
        });
    }
}

// Update a Desafio by the id in the request
exports.updateDesafio = async (req, res) => {
    if (!req.body || !req.body.nome) {
        return res.status(400).json({
            success: false,
            msg: "Dados inválidos!"
        });
        return;
    }

    try {

        if (req.loggedUserType != 'admin') {
            return res.status(403).json({
                success: false,
                msg: 'Apenas o administrador pode aceder a esta funcionalidade!',
            });
        }

        const desafio = await Desafio.findByIdAndUpdate(req.params.idDesafio, req.body, {
            useFindAndModify: false
        }).exec();
        if (desafio === null) {
            return res.status(404).json({
                success: false,
                msg: `Desafio com o id ${req.params.idDesafio} não encontrado!`
            });
        } else {
            res.status(200).json({
                success: true,
                msg: `Desafio com o id ${req.params.idDesafio} atualizado com sucesso!`
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: `Erro ao atualizar o desafio com o id ${req.params.idDesafio}!`
        });
    }
};

// Delete a Desafio with the specified id in the request
exports.deleteDesafio = async (req, res) => {
    try {
        if (req.loggedUserType != 'admin') {
            return res.status(403).json({
                success: false,
                msg: 'Apenas o administrador pode aceder a esta funcionalidade!',
            });
        }

        const desafio = await Desafio.findByIdAndRemove(req.params.idDesafio).exec();
        if (desafio === null) {
            return res.status(404).json({
                success: false,
                msg: `Desafio com o id ${req.params.idDesafio} não encontrado!`
            });
        } else {
            res.status(200).json({
                success: true,
                msg: `Desafio com o id ${req.params.idDesafio} eliminado com sucesso!`
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: `Erro ao eliminar o desafio com o id ${req.params.idDesafio}!`
        });
    }
};