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
  const { Schema } = mongoose;

  const EcopontoSchema = new Schema(
    {
      nome: { type: String, required: true },
      localizacao: { type: String, required: true },
      criador: { type: String},
      morada: { type: String, required: true },
      dataCriacao: { type: Date },
      foto: { type: String, validate: urlValidator },
      tipo: { type: String, required: true },
      latitude: { type: number},
      longitude: { type: number},
      validacao: { type: Boolean, default: false },
    },
    { timestamps: false }
  );

  const Ecoponto = mongoose.model('ecopontos', EcopontoSchema);
  return Ecoponto;
};
