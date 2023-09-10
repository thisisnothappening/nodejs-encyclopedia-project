const logRequest = require('../middleware/logRequest');
const User = require('../model/User.js');

const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies?.token || "";
		const user = await User.findOne({ where: { refreshToken: refreshToken } });
		if (!user) {
			return res.clearCookie("token", { httpOnly: true, secure: false, sameSite: 'Lax' })
				.sendStatus(204);
		}
		user.refreshToken = "";
		await user.save();
		logRequest(`User ${user.id} has logged out.`);

		return res.clearCookie("token", { httpOnly: true, secure: false, sameSite: 'Lax' })
			.sendStatus(204);
	} catch (err) {
		console.error(err);
		return res.status(err.status || 500).json({ error: err.message });
	}
};

module.exports = {
	logout
};
