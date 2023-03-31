const User = require('../model/User');

const getUsers = async (req, res) => {
	try {
		const users = await User.findAll();
		res.status(200).send({ users });
	} catch (err) {
		console.error(err);
		return res.status(err.status || 500).json({ error: err.message });
	}
};

module.exports = {
	getUsers
};