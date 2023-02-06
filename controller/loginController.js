const jwt = require('jsonwebtoken');
const User = require('../model/User.js');
const bcrypt = require('bcrypt');
const logError = require('../middleware/logError.js');
const logRequest = require('../middleware/logRequest');
const NullFieldError = require('../error/NullFieldError.js');
const ResourceNotFoundError = require("../error/ResourceNotFoundError.js");
const IncorrectPasswordError = require("../error/IncorrectPasswordError");

const login = async (req, res) => {
	logRequest(req);
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			throw new NullFieldError("Field cannot be null");
		}

		const user = await User.findOne({ where: { email: email } });
		if (!user) {
			throw new ResourceNotFoundError("User not found");
		}
		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) {
			throw new IncorrectPasswordError("Incorrect password");
		}

		const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

		res.cookie('token', token, { httpOnly: true, secure: true })
			.status(200)
			.send({ token });
	} catch (err) {
		logError(err);
		console.error(err);
		res.status(500).send({ error: err.message });
	}
};

module.exports = {
	login
};