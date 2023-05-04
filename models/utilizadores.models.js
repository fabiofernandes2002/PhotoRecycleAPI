module.exports = (mongoose) => {
    const utilizadores = mongoose.Utilizadores(
        {
            username: { type: String, required: true },
            tipo: { type: String, deafult: 'user' },
            email: { type: String, required: true, unique: true },
            datanascimento: { type: Date, required: true },
            password: { type: String, required: true },
            morada: { type: String, required: true },
            localidade: { type: String, required: true },
            codigopostal: { type: String, required: true },
            foto: { type: String },
            pontos: { type: Number, default: 0 },
            medalhas: { type: Number, default: 0 },
            ecopontosUtilizados: { type: Number, default: 0 },
            ecopontosRegistados: { type: Number, default: 0 },
            desafios: { type: Number, default: 0 },
            classificacao: { type: Number, default: 0 },
            diaSemana: { type: String, default: "" },
        },
        { timestamps: false }
    );
    const Utilizador = mongoose.model("tutorial", utilizadores);
    return Utilizador;
};
