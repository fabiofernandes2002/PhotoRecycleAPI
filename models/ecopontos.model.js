module.exports = (mongoose) => {
  const { Schema } = mongoose;

  const EcopontoSchema = new Schema(
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

  const Ecoponto = mongoose.model('ecopontos', EcopontoSchema);
  return Ecoponto;
};
