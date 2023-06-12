module.exports = (mongoose) => {
  const schema = mongoose.Schema({
    
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
        required: true,
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
  const RegistoUtilizacao = mongoose.model('registoUtilizacao', schema);
  return RegistoUtilizacao;
};
