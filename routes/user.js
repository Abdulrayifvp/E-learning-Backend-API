const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("user home");
});

module.exports = router;
