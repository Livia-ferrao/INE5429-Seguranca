const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { bool, boolean } = require("joi");

const UsuarioSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, "Por favor, informe o seu e-mail."],
		match: [
			/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
			"Por favor, informe um e-mail válido.",
		],
		unique: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: [true, "Por favor, informe a sua senha."],
		minlength: 6,
	},
	nome: {
		type: String,
		required: [true, "Por favor, informe o seu nome."],
		maxlength: 30,
		minlength: 3,
	},
	foto: {
		type: String,
		default: null,
	},
	inbox: {
		type: Array,
		default: [],
	},
	outbox: {
		type: Array,
		default: [],
	},
	genero: {
		type: String,
		default: null,
	},
	dataNasc: {
		type: Date,
		default: null,
	},
	criadoEm: {
		type: Date,
		default: Date,
	},
});

UsuarioSchema.pre("save", async function () {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UsuarioSchema.methods.criaToken = function () {
	return jwt.sign({ id: this._id, nome: this.nome }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

UsuarioSchema.methods.comparePassword = async function (tentativaDeSenha) {
	const confere = await bcrypt.compare(tentativaDeSenha, this.password);
	return confere;
};

module.exports = mongoose.model("Usuario", UsuarioSchema);
