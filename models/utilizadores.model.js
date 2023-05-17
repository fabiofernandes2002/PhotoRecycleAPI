const { url } = require('inspector');
const validate = require('mongoose-validator');

const urlValidator = [
  validate({
    validator: 'isURL',
    message: 'Deve ser uma URL válida',
  }),
];

module.exports = (mongoose) => {
  const { Schema } = mongoose;

  const UtilizadorSchema = new Schema(
    {
      username: {
        type: String,
        required: true,
      },
      tipo: {
        type: String,
        default: 'userNormal',
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      datanascimento: {
        type: Date,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      morada: {
        type: String,
        required: true,
      },
      localidade: {
        type: String,
        required: true,
      },
      codigopostal: {
        type: String,
        required: true,
      },
      foto: {
        type: String,
        validate: urlValidator,
        default: 'http://avatars.adorable.io/',
      },
      pontos: {
        type: Number,
        default: 0,
      },
      medalhas: {
        type: Array,
        default: [],
      },
      ecopontosUtilizados: {
        type: Number,
        default: 0,
      },
      ecopontosRegistados: {
        type: Number,
        default: 0,
      },
      desafios: {
        type: Array,
        default: [],
      },
      classificacao: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: false,
    }
  );

  const Utilizador = mongoose.model('utilizadores', UtilizadorSchema);
  return Utilizador;
};
