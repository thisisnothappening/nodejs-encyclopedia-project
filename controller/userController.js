const User = require('../model/user');

const getUsers = async (req, res) => {
	await User.findAll()
		.then(users => res.status(200).send({ users }))
		.catch(err => console.error(err));
};

module.exports = {
	getUsers
};