const logError = require("../middleware/logError");
const logRequest = require('../middleware/logRequest');

const logout = async (req, res) => {
	logRequest(req);
	try {
		res.clearCookie("token");
		res.status(200).send({ message: 'Successfully logged out' });
	} catch (err) {
		logError(err);
		console.error(err);
		res.status(500).json({ error: err.message });
	}
};

module.exports = {
	logout
};