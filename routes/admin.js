const express = require("express");
const router = express.Router();
const adminControl = require("../controllers/admin");
const auth = require("../middlewares/authentication.js");

router.post("/login", adminControl.postLogin);

module.exports = router;
