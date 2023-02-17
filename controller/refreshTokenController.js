const jwt = require('jsonwebtoken');
const User = require('../model/User.js');
const ResourceNotFoundError = require('../error/ResourceNotFoundError');

const refreshToken = async (req, res) => {
	try {
		const cookies = req.cookies;
		if (!cookies?.token) {
			// throw new ResourceNotFoundError("Token not found");
			return;
		}
		const refreshToken = cookies.token;
		console.log(refreshToken);

		const user = await User.findOne({ where: { refreshToken: refreshToken } });
		if (!user) {
			throw new ResourceNotFoundError("User not found");
		}

		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
			(err, decoded) => {
				if (err || user.id !== decoded.id) {
					return res.status(403);
				}
				const accessToken = jwt.sign(
					{ id: user.id },
					process.env.ACCESS_TOKEN_SECRET,
					{ expiresIn: "10s" } // change back to 10m
				);
				res.json({ accessToken, user });
			}
		);
	} catch (err) {
		console.error(err);
		return res.status(err.status || 500).send({ error: err.message });
	}
};

module.exports = {
	refreshToken
};