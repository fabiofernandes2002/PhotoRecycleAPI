const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate: {
            // username não pode ser nulo
            validator: (value) => {
                return value !== null;
            },
            message: 'Username não pode ser nulo!'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        allowNull: false,
        validate: {
            // password não pode ser nulo
            validator: (value) => {
                return value !== null;
            },
            message: 'Password não pode ser nulo!'
        }
    },
    confirmPassword: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        allowNull: false,
        validate: {
            // confirmPassword não pode ser nulo
            validator: (value) => {
                return value !== null;
            },
            message: 'ConfirmPassword não pode ser nulo!'
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate: {
            // email não pode ser nulo
            validator: (value) => {
                return value !== null;
            },
            message: 'Email não pode ser nulo!'
        }
    },
    dataNascimento: {
        type: Date,
        required: true,
    },
    morada: {
        type: String,
        required: true,
    },
    localidade: {
        type: String,
        required: true,
    },
    codigoPostal: {
        type: String,
        required: true,
    },
    tipo: {
        type: String,
        enum: ['admin', 'userNormal'],
        default: 'user',
        validate: {
            validator: function (value) {
                return ['admin', 'userNormal'].includes(value);
            },
            message: "Tipo de utilizador inválido (admin ou userNormal)!"
        }
    },
    pontos: {
        type: Number,
        default: 0
    },
    desafios: {
        type: [Number]
    },
    classificacao: {
        type: String,
        default: 'N/A'
    },
    medalhas: {
        type: [Number]
    },
    /* foto: {
        type: Buffer
    }, */
    ecopontosUtilizados: {
        type: Number,
        default: 0
    },
    ecopontosRegistados: {
        type: Number,
        default: 0
    },


});

const User = mongoose.model('User', userSchema);

module.exports = User;