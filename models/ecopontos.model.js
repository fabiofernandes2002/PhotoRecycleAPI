module.exports = (mongoose) => {
  const { Schema } = mongoose;

  const EcopontoSchema = new Schema(
    {
      nome: { type: String, required: true },
      localizacao: { type: String, required: true },
      criador: { type: String},
      morada: { type: String, required: true },
      dataCriacao: { type: Date },
      foto: { type: String, required: true },
      tipo: { type: String, required: true },
      latitude: { type: Number},
      longitude: { type: Number},
      validacao: { type: Boolean, default: false },
    },
    { timestamps: false }
  );

  const Ecoponto = mongoose.model('ecopontos', EcopontoSchema);
  return Ecoponto;
};
