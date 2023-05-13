const {
    url
} = require("inspector")
const validate = require('mongoose-validator');

const urlValidator = [
    validate({
        validator: 'isURL',
        message: 'Deve ser uma URL válida',
    }),
];

module.exports = (mongoose) => {
    const schema = mongoose.Schema({
        foto: {
            type: String,
            validate: urlValidator,
        },
        idUtilizador: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "utilizador",
        },
        morada: {
            type: String,
            required: [true, "O campo morada é obrigatório!"],
        },
        codigoPostal: {
            type: String,
            required: [true, "O campo código postal é obrigatório!"],
        },
        descricao: {
            type: String,
            required: [true, "O campo descrição é obrigatório!"],
        },
        comentario: {
            type: String,
        },
        dataCriacao: {
            type: Date,
            default: Date.now(),
        },
        validacao: {
            type: Boolean,
            default: false,
        },
    }, {
        timestamps: false
    });
    const AdicaoEcoponto = mongoose.model("adicaoEcoponto", schema);
    return AdicaoEcoponto;
};