const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require("../models");
const config = require("../config/db.config.js");
const User = db.User;

// Registar um novo utilizador
exports.registo = async (req, res) => {
    try {
        // todos os campos são obrigatórios
        if (!req.body.username || !req.body.password || !req.body.confirmPassword || !req.body.email || !req.body.dataNascimento ||
            !req.body.morada || !req.body.localidade || !req.body.codigoPostal || !req.body.tipo) {
            return res.status(400).send({
                success: false,
                msg: "Todos os campos são obrigatórios!"
            });
        }
        // verificar se o username já existe
        const usernameExist = await User.findOne({
            username: req.body.username
        }).exec();
        if (usernameExist) {
            return res.status(400).send({
                success: false,
                msg: "Username já existe!"
            });
        }
        // verificar se o email já existe
        const emailExist = await User.findOne({
            email: req.body.email
        }).exec();
        if (emailExist) {
            return res.status(400).send({
                success: false,
                msg: "Email já existe!"
            });
        }

        // verficar se a password e a confirmação são iguais
        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).send({
                success: false,
                msg: "Password e confirmação não são iguais!"
            });
        }
        // criar um novo utilizador
        const user = new User({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8),
            email: req.body.email,
            dataNascimento: req.body.dataNascimento,
            morada: req.body.morada,
            localidade: req.body.localidade,
            codigoPostal: req.body.codigoPostal,
            tipo: req.body.tipo,
            pontos: 0,
            desafios: [],
            classificacao: 'N/A',
            medalhas: [],
            ecopontosUtilizados: 0,
            ecopontosRegistados: 0

        });
        // guardar o utilizador na base de dados
        const userCreated = await user.save();
        res.status(201).json({
            success: true,
            msg: `Utilizador ${userCreated.username} registado com sucesso!`
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            msg: `Algo deu errado. Por favor, tente novamente mais tarde.`
        });
    }
}

// Login
exports.login = async (req, res) => {

    try {
        if (!req.body || !req.body.email || !req.body.password) return res.status(400).json({
            success: false,
            msg: "Email e password são obrigatórios!"
        });

        let user = await User.findOne({
            email: req.body.email
        }).exec();
        if (!user) {
            return res.status(400).send({
                success: false,
                msg: "Email incorreto!"
            });
        }
        // verificar se a password é válida
        const validPassword = bcrypt.compareSync(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).send({
                success: false,
                msg: "Password incorreta!"
            });
        }
        // sign the given payload (user ID and role) into a JWT payload –builds JWT token, using secret key
        const token = jwt.sign({
            id: User.id,
            tipo: User.tipo
        }, config.SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
        // return the JWT token for the future API calls
        res.status(200).send({
            success: true,
            msg: "Login efetuado com sucesso!",
            token: token
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            msg: `Algo deu errado. Por favor, tente novamente mais tarde.`
        });
    }

}

exports.getAllUsers = async (req, res) => {
    try {
        if (req.loggedUserRole !== "admin") {
            return res.status(403).json({
                success: false,
                msg: "Apenas o administrador pode aceder a esta funcionalidade!"
            });
        }

        // Obter todos os usuários com atributos selecionados
        const users = await User.find({}, 'id username email tipo ');

        res.status(200).json({
            success: true,
            users: users
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || "Algo deu errado. Por favor, tente novamente mais tarde."
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        if (req.loggedUserId !== req.params.id && req.loggedUserRole !== "admin") {
            return res.status(403).json({
                success: false,
                msg: "Apenas o administrador pode aceder a esta funcionalidade!"
            });
        }

        // Buscar o usuário pelo ID com atributos selecionados
        const user = await User.findById(req.params.id, 'id username email tipo');

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: `Utilizador com ID ${req.params.id} não encontrado!`
            });
        }

        res.status(200).json({
            success: true,
            user: user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || `Algo deu errado. Por favor, tente novamente mais tarde.`
        });
    }
}