const express = require("express");
const router = express.Router();
const userControls = require("../controllers/user");
const auth = require("../middlewares/authentication.js");

router.post("/register", userControls.postRegister);

router.post("/login", userControls.postLogin);

module.exports = router;
