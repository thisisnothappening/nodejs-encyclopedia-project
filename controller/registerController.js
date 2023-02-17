const bcrypt = require('bcrypt');
const logRequest = require('../middleware/logRequest');
const User = require('../model/user');
const NullFieldError = require('../error/NullFieldError.js');
const DuplicateValueError = require("../error/DuplicateValueError");
const IncorrectPasswordError = require('../error/IncorrectPasswordError');

const register = async (req, res) => {
	try {
		const { email, username, password, secretCode } = req.body;

		if (!email || !username || !password || !secretCode) {
			throw new NullFieldError("Field cannot be null");
		}
		if (secretCode !== "KLHAZ6a2HIhWE53Y") {
			throw new IncorrectPasswordError("Incorrect secret code");
		}
		const userCheck = await User.findOne({ where: { email: email } });
		if (userCheck) {
			throw new DuplicateValueError("Email already exists");
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			email: email,
			username: username,
			password: hashedPassword,
		});

		res.status(201).send({ user });
		logRequest(`User ${user.id} has been created.`);
	} catch (err) {
		console.error(err);
		return res.status(err.status || 500).send({ error: err.message });
	}
};

module.exports = {
	register
};