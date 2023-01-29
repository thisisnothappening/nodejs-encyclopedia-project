const logError = require("./logError");

const errorHandler = (err, req, res, next) => {
	logError(err);
	console.error(err.stack);
	res.status(500).send("Something went wrong!");
};

module.exports = errorHandler;