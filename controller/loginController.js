const jwt = require('jsonwebtoken');
const User = require('../model/User.js');
const bcrypt = require('bcrypt');
const logRequest = require('../middleware/logRequest');
const NullFieldError = require('../error/NullFieldError.js');
const ResourceNotFoundError = require("../error/ResourceNotFoundError.js");
const IncorrectPasswordError = require("../error/IncorrectPasswordError");

const login = async (req, res) => {
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

		const accessToken = jwt.sign(
			{ id: user.id },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '10s' } // change back to 10m
		);
		const refreshToken = jwt.sign(
			{ id: user.id },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);
		user.refreshToken = refreshToken;
		await user.save();

		res.cookie("token", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "None",
			maxAge: 24 * 60 * 60 * 1000
		})
			.status(200)
			.send({ accessToken });
		logRequest(`User ${user.id} has logged in.`);
	} catch (err) {
		console.error(err);
		return res.status(err.status || 500).send({ error: err.message });
	}
};

module.exports = {
	login
};