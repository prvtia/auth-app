const express = require("express");
const { setCredentials, loginUser, resetPassword } = require("../controllers/authController");

const router = express.Router();

router.post("/set-credentials", setCredentials);
router.post("/login", loginUser);
router.post("/reset-password",resetPassword);

module.exports = router;
