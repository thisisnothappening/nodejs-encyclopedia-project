class CategoryNotFoundError extends Error {
	constructor (message) {
		super(message);
		this.name = this.constructor.name;
		this.description = message;
		Error.captureStackTrace(this, this.constructor);
		this.status = 404;
	}
}

module.exports = CategoryNotFoundError;