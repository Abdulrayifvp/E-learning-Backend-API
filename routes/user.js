const express = require("express");
const router = express.Router();
const userControls = require("../controllers/user");
const auth = require("../middlewares/authentication.js");

router.get("/", userControls.getHome);

router.post("/register", userControls.postRegister);

router.get("/login", userControls.getlogin);

router.post("/login", userControls.postLogin);

router.get("/test", auth, userControls.getTest);

module.exports = router;
