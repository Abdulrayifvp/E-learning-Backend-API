const express = require("express");
const router = express.Router();
const instructorControls = require("../controllers/instructor");
const auth = require("../middlewares/authentication.js");

router.post("/register", instructorControls.postRegister);

router.post("/login", instructorControls.postLogin);

module.exports = router;
