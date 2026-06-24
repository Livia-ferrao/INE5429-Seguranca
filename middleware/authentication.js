const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const UnauthenticatedError = require("../errors/unauthenticated");

const auth = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new UnauthenticatedError("Necessário fazer login");
	}
	const token = authHeader.split(" ")[1];
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.usuario = { userId: payload.userId, nome: payload.nome };
		next();
	} catch (error) {
		throw new UnauthenticatedError("Necessário fazer login");
	}
};

module.exports = auth;
