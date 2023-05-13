module.exports = (mongoose) => {
    const schema = mongoose.Schema({
        nome: {
            type: String,
            required: [true, "O campo nome é obrigatório!"],
        },
        descricao: {
            type: String,
            required: [true, "O campo descrição é obrigatório!"],
        },
        dataInicio: {
            type: Date,
            required: [true, "O campo data de início é obrigatório!"],
        },
        dataFim: {
            type: Date,
            required: [true, "O campo data de fim é obrigatório!"],
        },
        recompensa: {
            type: String,
            required: [true, "O campo recompensa é obrigatório!"],
        },
        // estado do desafio (0 - não iniciado, 1 - em andamento, 2 - finalizado)
        estado: {
            type: Number,
            enum: [0, 1, 2],
            default: 0,
            validate: {
                validator: function (value) {
                    return [0, 1, 2].includes(value);
                },
                message: "O estado do desafio deve ser 0, 1 ou 2!",
            },
        },
        // pontuação do desafio
        pontuacao: {
            type: Number,
            required: [true, "O campo pontuação é obrigatório!"],
        },
    }, {
        timestamps: false
    });
    const Desafio = mongoose.model("desafio", schema);
    return Desafio;
};