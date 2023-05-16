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
        criador: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "utilizador",
        },
        localizacao: {
            type: String,
            required: true
        },
        morada: {
            type: String,
            required: [true, "O campo morada é obrigatório!"],
        },
        tipo: {
            type: String,
            required: true
        },
        latitude: {
            type: String,
            required: true
        },
        longitude: {
            type: String,
            required: true
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