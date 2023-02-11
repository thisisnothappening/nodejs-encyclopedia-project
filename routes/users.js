const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.route("/")
	.get(userController.getUsers);

router.route("/user")
	.get(userController.getUserByRefreshToken);

module.exports = router;