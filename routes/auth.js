const express = require("express");
const router = express.Router();
const registerController = require("../controller/registerController.js");
const loginController = require("../controller/loginController.js");
const refreshTokenController = require("../controller/refreshTokenController.js");
const logoutController = require("../controller/logoutController.js");

router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/refresh", refreshTokenController.refreshToken);
router.get("/logout", logoutController.logout);

module.exports = router;
