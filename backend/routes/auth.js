const express = require("express");
const { setCredentials, loginUser } = require("../controllers/authController");

const router = express.Router();

router.post("/set-credentials", setCredentials);
router.post("/login", loginUser);

module.exports = router;
