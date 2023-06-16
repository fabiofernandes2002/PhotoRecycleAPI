module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      nome: {
        type: String,
        required: [true, 'O campo nome é obrigatório!'],
      },
      descricao: {
        type: String,
        required: [true, 'O campo descrição é obrigatório!'],
      },
      recompensa: {
        type: String,
        required: [true, 'O campo recompensa é obrigatório!'],
      },
    },
    {
      timestamps: true,
    }
  );
  const Desafio = mongoose.model('desafios', schema);
  return Desafio;
};
