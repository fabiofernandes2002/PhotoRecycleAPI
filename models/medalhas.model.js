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
        nomeMedalha: {
            type: String,
            required: [true, "O campo nome é obrigatório!"],
        },
        urlMedalha: {
            type: String,
            validate: urlValidator,
            required: [true, "O campo url é obrigatório!"],
        },
        pontos: {
            type: Number,
            required: [true, "O campo pontos é obrigatório!"],
        },
    }, {
        timestamps: false
    });
    const Medalha = mongoose.model("medalhas", schema);
    return Medalha;
};