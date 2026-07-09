const CustomAPIError = require("./custom-error");
const UnauthenticatedError = require("./unauthenticated").default;
const NotFoundError = require("./not-found");
const BadRequestError = require("./bad-request");

module.exports = {
	CustomAPIError,
	UnauthenticatedError,
	NotFoundError,
	BadRequestError,
};
