const User = require('../model/user');
const logError = require('../middleware/logError.js');
const logRequest = require('../middleware/logRequest');

const getUsers = async (req, res) => {
	logRequest(req);
	try {
		const users = await User.findAll();
		res.status(200).send({ users });
	} catch (err) {
		logError(err);
		console.error(err);
		return res.status(err.status || 500).json({ error: err.message });
	}
};

module.exports = {
	getUsers
};