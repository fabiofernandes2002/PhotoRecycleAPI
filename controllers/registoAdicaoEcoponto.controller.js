const db = require("../models");
const AdicaoEcoponto = db.registoadicaoecoponto;

// Retrieve all AdicaoEcopontos from the database.
exports.findAllRegistoAdicaoEcopontos = async (req, res) => {
    const idUtilizador = req.query.idUtilizador;
    const condition = idUtilizador ? {
        idUtilizador: {
            new: RegExp(idUtilizador, "i")
        }
    } : {};

    try {
        if (req.loggedUserType != 'admin') {
            return res.status(403).json({
                success: false,
                msg: 'Apenas o administrador pode aceder a esta funcionalidade!',
            });
        }

        const data = await AdicaoEcoponto.find(condition).
        select('foto criador localizacao morada tipo latitude longitude dataCriacao validacao').
        exec();
        res.status(200).json({
            success: true,
            registoAdicaoEcopontos: data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao tentar recuperar os ecopontos."
        });
    }
}

// Find a single AdicaoEcoponto with an id
exports.findOneRegistoAdicaoEcoponto = async (req, res) => {
    const idAdicaoEcoponto = req.params.idAdicaoEcoponto;

    try {
        if (req.loggedUserType != 'admin') {
            return res.status(403).json({
                success: false,
                msg: 'Apenas o administrador pode aceder a esta funcionalidade!',
            });
        }

        const data = await AdicaoEcoponto.findById(idAdicaoEcoponto).
        select('foto idUtilizador localizacao morada tipo latitude longitude dataCriacao validacao').
        exec();
        if (!data)
            res.status(404).json({
                success: false,
                msg: `Não foi encontrado nenhum ecoponto com o id ${idAdicaoEcoponto}`
            });
        else res.status(200).json({
            success: true,
            regsitoAdicaoEcoponto: data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: `Erro ao tentar encontrar o ecoponto com o id ${idAdicaoEcoponto}`
        });
    }
}

// delete a AdicaoEcoponto with the specified id in the request
exports.deleteRegistoAdicaoEcoponto = async (req, res) => {
    const idAdicaoEcoponto = req.params.idAdicaoEcoponto;

    try {
        if (req.loggedUserType != 'admin') {
            return res.status(403).json({
                success: false,
                msg: 'Apenas o administrador pode aceder a esta funcionalidade!',
            });
        }

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
exports.validarRegistoAdicaoEcoponto = async (req, res) => {
    const idAdicaoEcoponto = req.params.idAdicaoEcoponto;

    try {
        if (req.loggedUserType != 'admin') {
            return res.status(403).json({
                success: false,
                msg: 'Apenas o administrador pode aceder a esta funcionalidade!',
            });
        }

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