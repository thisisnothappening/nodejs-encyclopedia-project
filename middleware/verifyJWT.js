const { verify } = require('jsonwebtoken');
const { TokenExpiredError } = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization || req.headers.Authorization;
		if (!authHeader?.startsWith("Bearer ")) {
			throw new TokenExpiredError("Token not found");
		}
		const token = authHeader.split(" ")[1];
		console.log(token);
		verify(
			token,
			process.env.ACCESS_TOKEN_SECRET,
			(err, decoded) => {
				if (err) {
					throw new TokenExpiredError("Token not found");
				}
				req.user = decoded.email; // wtf is this for?
				next();
			}
		);
	} catch (err) {
		console.log(err);
		let status;
		if (err instanceof TokenExpiredError) {
			status = 401;
		} else {
			status = 500;
		}
		res.status(status).send({ error: err.message });
	}
};

module.exports = verifyJWT;