const bcrypt = require('bcrypt');
const logError = require('../middleware/logError');
const logRequest = require('../middleware/logRequest');
const User = require('../model/user');
const DuplicateValueError = require("../error/DuplicateValueError");

const register = async (req, res) => {
	logRequest(req);
	try {
		const { email, username, password } = req.body;

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
	} catch (err) {
		logError(err);
		console.error(err);
		res.status(400).send({ error: err.message });
	}
};

module.exports = {
	register
};