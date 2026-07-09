const mongoose = require("mongoose");

const EstagioSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: [true, "Por favor, informe um id."],
  },
  titulo: {
    type: String,
    required: [true, "Por favor, informe o título do estágio."],
    maxlength: 100,
    minlength: 5,
  },
  autor: {
    type: String,
    required: [true, "Por favor, informe o autor do estágio (email)."],
  },
  empresa: {
    type: String,
    required: [true, "Por favor, informe a empresa do estágio."],
  },
  local: {
    type: String,
    required: [true, "Por favor, informe o endereço do estágio."],
  },
  descricao: {
    type: String,
    required: [true, "Por favor, informe a descrição do estágio."],
    maxlength: 500,
    minlength: 5,
  },
  imagem: {
    type: String,
    default: null,
  },
  periodo: {
    type: String,
    required: [true, "Por favor, informe o período do estágio."],
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Estagio", EstagioSchema);
