const Estagio = require("../models/Estagio");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllEstagios = async (req, res) => {
	const estagios = await Estagio.find({}).sort("titulo");
	res.status(StatusCodes.OK).json({ estagios: estagios });
};

const getEstagio = async (req, res) => {
	const {
		params: { id: estagioId },
	} = req;
	const estagio = await Estagio.findOne({ _id: estagioId });
	if (!estagio) {
		throw new NotFoundError(`Não existe estágio com id ${estagioId}`);
	}
	res.status(StatusCodes.OK).json({ estagio: estagio });
};

const createEstagio = async (req, res) => {
	const estagio = await Estagio.create({ ...req.body });
	res.status(StatusCodes.CREATED).json({ estagio: estagio });
};

const updateEstagio = async (req, res) => {
	const {
		body: { nome, descricao, ativo },
		params: { id: estagioId },
	} = req;
	if (nome === "" || descricao === "" || ativo === "") {
		throw new BadRequestError("Nome, descrição e ativo são obrigatórios");
	}
	const estagio = await Estagio.findByIdAndUpdate(
		{ _id: estagioId },
		req.body,
		{ new: true, runValidators: true }
	);
	if (!estagio) {
		throw new NotFoundError(`Não existe estágio com id ${estagioId}`);
	}
	res.status(StatusCodes.OK).json({ estagio: estagio });
};

const deleteEstagio = async (req, res) => {
	const {
		params: { id: estagioId },
	} = req;
	const estagio = await Estagio.findOneAndRemove({ _id: estagioId });
	if (!estagio) {
		throw new NotFoundError(`Não existe estágio com id ${estagioId}`);
	}
	res.status(StatusCodes.OK).send();
};

module.exports = {
	getAllEstagios,
	getEstagio,
	createEstagio,
	updateEstagio,
	deleteEstagio,
};
