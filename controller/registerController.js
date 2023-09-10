const bcrypt = require('bcrypt');
const logRequest = require('../middleware/logRequest');
const User = require('../model/User');
const NullFieldError = require('../error/NullFieldError.js');
const DuplicateValueError = require("../error/DuplicateValueError");
const InvalidFieldError = require('../error/InvalidFieldError');

// https://www.w3resource.com/javascript/form/email-validation.php
// https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username
// https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a

const register = async (req, res) => {
	try {
		const { email, username, password, secretCode } = req.body;

		if (!email || !username || !password || !secretCode) {
			throw new NullFieldError("Field cannot be null");
		}
		if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
			throw new InvalidFieldError("Invalid email");
		}

		// 1. Only contains alphanumeric characters, underscore and dot.
		// 2. Underscore and dot can't be at the end or start of a username (e.g _username / username_ / .username / username.).
		// 3. Underscore and dot can't be next to each other (e.g user_.name).
		// 4. Underscore or dot can't be used multiple times in a row (e.g user__name / user..name).
		// 5. Number of characters must be between 8 to 20.
		if (!/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(username)) {
			throw new InvalidFieldError("Invalid username");
		}

		// 1. At least one upper case English letter, (?=.*?[A-Z])
		// 2. At least one lower case English letter, (?=.*?[a-z])
		// 3. At least one digit, (?=.*?[0-9])
		// 4. At least one special character, (?=.*?[#?!@$%^&*-])
		// 5. Minimum eight in length .{8,} (with the anchors)
		if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(password)) {
			throw new InvalidFieldError("Invalid password");
		}
		if (secretCode !== "KLHAZ6a2HIhWE53Y") {
			throw new InvalidFieldError("Incorrect secret code");
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

		res.sendStatus(201);
		logRequest(`User ${user.id} has been created.`);
	} catch (err) {
		console.error(err);
		return res.status(err.status || 500).send({ error: err.message });
	}
};

module.exports = {
	register
};
