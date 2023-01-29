const express = require("express");
const router = express.Router();
const registerController = require("../controller/registerController")
const loginController = require("../controller/loginController.js");
const logoutController = require("../controller/logoutController.js");

router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/logout", logoutController.logout);

module.exports = router;