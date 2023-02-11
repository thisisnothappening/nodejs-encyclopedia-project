const logError = require("../middleware/logError");
const logRequest = require('../middleware/logRequest');
const User = require('../model/User.js');

const logout = async (req, res) => {
	logRequest(req);
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
};

module.exports = {
	logout
};