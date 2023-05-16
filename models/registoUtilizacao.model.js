const { isURL } = require('mongoose-validator');
const mongoose = require('mongoose');

const urlValidator = [
  {
    validator: isURL,
    message: 'Deve ser uma URL válida',
  },
];

const RegistoUtilizacaoSchema = new mongoose.Schema(
  {
    idUtilizador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'utilizador',
    },
    idEcoponto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ecoponto',
    },
    dataUtilizacao: {
      type: Date,
      default: Date.now,
    },
    foto: {
      type: String,
      validate: urlValidator,
    },
    dataCriacao: {
      type: Date,
      default: Date.now,
    },
    validacao: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: false,
  }
);

const RegistoUtilizacao = mongoose.model('RegistoUtilizacao', RegistoUtilizacaoSchema);

module.exports = RegistoUtilizacao;
