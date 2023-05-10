module.exports = (mongoose) => {
    const ecopontos = mongoose.Ecopontos(
        {
            nome: { type: String, required: true },
            localizacao: { type: String, required: true },
            morada: { type: String, required: true },
            dataCriacao: { type: Date, required: true },
            estado: { type: String, required: true },
            tipo: { type: String, required: true },
            latitude: { type: String, required: true },
            longitude: { type: String, required: true },
            validacao: { type: Boolean, default: false },
        },
        { timestamps: false }
    );
    const Ecoponto = mongoose.model("ecopoint", ecopontos);
    return Ecoponto;
};