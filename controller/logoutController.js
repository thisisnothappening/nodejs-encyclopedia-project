const logError = require("../middleware/logError");
const logRequest = require('../middleware/logRequest');
const User = require('../model/User.js');

const logout = async (req, res) => {
	logRequest(req);
	try {
		const refreshToken = req.cookies?.token || "";
		const user = await User.findOne({ where: { refreshToken: refreshToken } });
		if (!user) {
			return res.clearCookie("token", { httpOnly: true, secure: true, sameSite: 'None' })
				.sendStatus(204);
		}
		user.refreshToken = "";
		await user.save();

		return res.clearCookie("token", { httpOnly: true, secure: true, sameSite: 'None' })
			.sendStatus(204);
	} catch (err) {
		logError(err);
		console.error(err);
		return res.status(err.status || 500).json({ error: err.message });
	}
};

module.exports = {
	logout
};