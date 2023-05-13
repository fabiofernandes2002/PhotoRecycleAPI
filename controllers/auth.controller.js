const jwt = require('jsonwebtoken');
const config = require('../config/db.config.js'); // Arquivo de configuração com a chave secreta

const db = require('./models');
const User = db.User;

exports.verifyToken = async (req, res, next) => {
    const header = req.headers['x-access-token'] || req.headers.authorization;
    if (typeof header === 'undefined') {
        return res.status(401).json({
            success: false,
            msg: "No token provided!"
        });
    }

    const bearer = header.split(' ');
    const token = bearer[1];

    try {
        let decoded = jwt.verify(token, config.SECRET);
        req.loggedUserId = decoded.id;
        req.loggedUserRole = decoded.tipo;
        next();

        // Buscar informações do usuário com base no id decodificado
        const user = await User.findById(req.loggedUserId);
        if (!user) {
            return res.status(401).json({
                success: false,
                msg: "Unauthorized!"
            });
        }

        // Adicione as informações do usuário ao objeto de solicitação (req) para uso posterior
        req.user = user;

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            msg: "Unauthorized!"
        });
    }
};