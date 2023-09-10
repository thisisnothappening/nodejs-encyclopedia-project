class NullFieldError extends Error {
	constructor (message) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
		this.status = 400;
	}
}

module.exports = NullFieldError;
