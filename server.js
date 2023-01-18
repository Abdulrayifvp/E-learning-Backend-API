const express = require("express");
const app = express();
const logger = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(logger("dev"));
require("dotenv/config");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.listen(process.env.PORT, () => {
  console.log("Sever is Running  http://localhost:" + process.env.PORT);
});

mongoose.connect(process.env.CONNECTION_STRING).then(() => {
  console.log("Database Connnected");
});

const userRouter = require("./routes/user.js");
const instructorRouter = require("./routes/instructor.js");
const adminRouter = require("./routes/admin.js");

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/instructor", instructorRouter);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
