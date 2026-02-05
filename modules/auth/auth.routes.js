// modules/auth/auth.routes.js
const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");

router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);

module.exports = router;
