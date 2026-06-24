const notFound = (req, res, next) => {
	res.status(404).send("Rota não existe");
};

module.exports = notFound;
