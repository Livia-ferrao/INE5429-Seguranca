const mongoose = require("mongoose");

const MensagemSchema = new mongoose.Schema({
	titulo: {
		type: String,
		required: [true, "Por favor, informe o tútulo da mensagem."],
	},
	remetente: {
		type: String,
		required: [true, "Por favor, informe o autor da mensagem."],
	},
	destinatario: {
		type: String,
		required: [true, "Por favor, informe o destinatário da mensagem."],
	},
	mensagem: {
		type: String,
		required: [true, "Por favor, informe o texto da mensagem."],
	},
	criadoEm: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Mensagem", MensagemSchema);
