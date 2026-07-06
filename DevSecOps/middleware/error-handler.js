const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
	let customError = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		message: err.message || "Algo deu errado, tente novamente",
	};
	if (err.name === "ValidationError") {
		customError.message = Object.values(err.errors)
			.map((item) => item.message)
			.join(", ");
		customError.statusCode = 400;
	}
	if (err.code && err.code === 11000) {
		customError.message = `O valor ${err.keyValue.email} já foi cadastrado`;
		customError.statusCode = 400;
	}

	if (err.name === "CastError") {
		customError.message = `Não existe item com o id ${err.value}`;
		customError.statusCode = 404;
	}
	return res.status(customError.statusCode).json({ msg: customError.message });
};
module.exports = errorHandlerMiddleware;
