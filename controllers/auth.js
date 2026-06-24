const Usuario = require("../models/Usuario");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const cadastro = async (req, res) => {
	const { email, nome, password } = req.body;
	console.log(req.body);
	if (nome === "" || email === "" || password === "") {
		throw new BadRequestError("Nome, email e senha são obrigatórios");
	}

	const usuario = await Usuario.create({ ...req.body });  
	const token = usuario.criaToken();
	 
	res.status(StatusCodes.CREATED).json({ usuario: usuario, token: token });
}

const login = async (req, res) => {
	const { email, password } = req.body;

	if (email === "" || password === "") {
		throw new BadRequestError("Email e senha são obrigatórios");
	}
	const usuario = await Usuario.findOne({ email });

	if (!usuario) {
		throw new NotFoundError(`Não existe usuário com email ${email}`);
	}

	const isPasswordCorrect = await usuario.comparePassword(password);
	if (!isPasswordCorrect) {
		throw new BadRequestError("Email e/ou senha incorretos");
	}
	
	const token = usuario.criaToken();
	console.log(
		`Bem-vinde, ${usuario.nome}, seu token de autenticação é ${token}`
	);
	res.status(StatusCodes.OK).json({ usuario, token: token });
};

const update = async (req, res) => {
	const { email, nome, genero, dataNasc } = req.body;
	
	const usuario = await Usuario.findOne({ email });
	if(!usuario) {
		throw new NotFoundError("Usuário não encontrado.");
	}

	try {
		if(genero) {
			await Usuario.updateOne(
				{ _id: usuario._id },
				{ $set: { genero } }
			  );
		}
		if(dataNasc) {
			await Usuario.updateOne(
				{ _id: usuario._id },
				{ $set: { dataNasc } }
			);
		if(nome) {
			await Usuario.updateOne(
				{ _id: usuario._id },
				{ $set: { nome } }
			);
		  }
		}
		console.log('Usuário atualizado com sucesso.');		
	} catch (error) {
		console.error('Erro ao atualizar usuário:', error);
	}
	
	console.log(usuario)
	res.status(StatusCodes.OK).json({ usuario });
}

module.exports = {
	cadastro,
	login,
	update
};
