class NullFieldError extends Error {
	constructor (message) {
		super(message);
		this.name = this.constructor.name;
		this.description = message;
		Error.captureStackTrace(this, this.constructor);
		this.status = 400;
	}
}

module.exports = NullFieldError;