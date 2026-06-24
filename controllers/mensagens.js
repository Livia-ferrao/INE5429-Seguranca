const Mensagem = require("../models/Mensagem");
const asyncWrapper = require("../middleware/async");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError, CustomAPIError } = require("../errors");
const Usuario = require("../models/Usuario");

const getAllMensagens = asyncWrapper(async (req, res) => {
	const mensagens = await Mensagem.find({}).sort("nome");
	res.status(StatusCodes.OK).json({ mensagens: mensagens });
});

const getMensagem = asyncWrapper(async (req, res) => {
	const {
		params: { id: mensagemId },
	} = req;
	const mensagem = await Mensagem.findOne({ _id: mensagemId });
	if (!mensagem) {
		throw new NotFoundError(`Não existe mensagem com id ${mensagemId}`);
	}
	res.status(StatusCodes.OK).json({ mensagem: mensagem });
});

const createMensagem = asyncWrapper(async (req, res) => {
	console.log(req.body)
	const { titulo, mensagem, remetente, destinatario } = req.body
	if (remetente === "" || destinatario === "" || titulo === "" || mensagem === "") {
		throw new BadRequestError("Informe todos os campos corretamente.");
	}

	const usuarioRemetente = await Usuario.findOne({ email: remetente })
	const usuarioDestinatario = await Usuario.findOne({ email: destinatario })

	if(!usuarioRemetente) {
		throw new NotFoundError(`Não existe usuário com email ${remetente}`);
	} 
	if(!usuarioDestinatario) {
		throw new NotFoundError(`Não existe usuário com email ${destinatario}`);
	}

	const novaMensagem = await Mensagem.create(req.body);

	try {
		await Usuario.updateOne(
			{ _id: usuarioRemetente._id },
			{ $push: { outbox: novaMensagem } }
		  );
		  
		await Usuario.updateOne(
			{ _id: usuarioDestinatario._id },
			{ $push: { inbox: novaMensagem } }
		);
		console.log('Boxes atualizadas com sucesso.');		
	} catch (error) {
		console.error('Erro ao atualizar boxes:', error);
	}

	console.log(usuarioRemetente.outbox)
	console.log(usuarioDestinatario.inbox)
	res.status(StatusCodes.CREATED).json({ mensagem: novaMensagem });
	
});

const updateMensagem = asyncWrapper(async (req, res) => {
	const {
		body: { nome, descricao, ativo },
		params: { id: mensagemId },
	} = req;
	if (nome === "" || descricao === "" || ativo === "") {
		throw new BadRequestError("Nome, descrição e ativo são obrigatórios");
	}
	const mensagem = await Mensagem.findByIdAndUpdate(
		{ _id: mensagemId },
		req.body,
		{ new: true, runValidators: true }
	);
	if (!mensagem) {
		throw new NotFoundError(`Não existe mensagem com id ${mensagemId}`);
	}
	res.status(StatusCodes.OK).json({ mensagem: mensagem });
});

const deleteMensagem = asyncWrapper(async (req, res) => {
	const {
		params: { id: mensagemId },
	} = req;
	const mensagem = await Mensagem.findOneAndRemove({ _id: mensagemId });
	if (!mensagem) {
		throw new NotFoundError(`Não existe mensagem com id ${mensagemId}`);
	}
	res.status(StatusCodes.OK).send();
});

module.exports = {
	getAllMensagens,
	getMensagem,
	createMensagem,
	updateMensagem,
	deleteMensagem,
};
