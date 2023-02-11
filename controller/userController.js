const ResourceNotFoundError = require('../error/ResourceNotFoundError');
const User = require('../model/user');
const logError = require('../middleware/logError.js');
const logRequest = require('../middleware/logRequest');

const getUsers = async (req, res) => {
	logRequest(req);
	await User.findAll()
		.then(users => res.status(200).send({ users }))
		.catch(err => console.error(err));
};

// temporary
const getUserByRefreshToken = async (req, res) => {
	logRequest(req);
	try {
		const refreshToken = req.cookies?.token || "";
		const user = await User.findOne({ where: { refreshToken: refreshToken } });
		if (!user) {
			throw new ResourceNotFoundError("User not found");
		}
		return res.status(200).send(user);
	} catch (err) {
		logError(err);
		console.error(err);
		return res.status(err.status || 500).json({ message: err.message });
	}
};

module.exports = {
	getUsers,
	getUserByRefreshToken
};