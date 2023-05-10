const db = require("../models");
const User = db.Users;
/* exports.create = async (req, res) => {
    const user = new User({ 
        username: req.body.username,
        email: req.body.email,
        datanascimento: req.body.datanascimento,
        password: req.body.password,
        morada: req.body.morada,
        localidade: req.body.localidade,
        codigopostal: req.body.codigopostal,        
    });
    try {
        const newUser = await user.save();
        res.status(201).json({ 
            success: true, 
            msg: "Utilizador registado com sucesso.", 
            URL: `/users/${newUser._id}`
        });
    }
    catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach((key) => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({ 
                success: false, 
                msg: errors });
        }
        res.status(500).json({
            success: false,
            msg: err.message || "Algo deu errado. Por favor, tente novamente mais tarde. "
        });
    }
};
 */

exports.editProfile = async (req, res) => {
    if (!req.body || !req.body.username) { // validate request body data
        res.status(400).json({ message: "Request body can not be empty!" });
        return;
    }
    try {
        const username = await User.findByIdAndUpdate(req.params.username, req.body, {
            useFindAndModify: false
        }).exec();
        const email = await User.findByIdAndUpdate(req.params.email, req.body, {
            useFindAndModify: false
        }).exec();

        if (!username || !email) // returns the found document (if any) to the callback
            res.status(400).json({
                message: `Username ou email já existem!`
            });
        else
            res.status(200).json({
                message: `Dados atualizados com sucesso!`
            });
    } catch (err) {
        res.status(500).json({
            message: `Algo deu errado. Por favor, tente novamente mais tarde.`
        });
    };
};


