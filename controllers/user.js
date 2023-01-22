const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = require("../models/user.js");

module.exports = {
  getHome: (req, res, next) => {
    res.send("user home");
  },
  getlogin: (req, res, next) => {
    res.status(200).json({
      message: "login page loaded",
    });
  },
  postLogin: async (req, res, next) => {
    try {
      // Get user input
      const { email, password } = req.body;

      // Validate if user exist in our database
      const user = await userSchema.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, type: "user" },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );

        // save user token
        user.token = token;

        // user
        res.status(200).json(user.token);
      } else {
        res.status(401).send("Invalid Credentials");
      }
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  },
  postRegister: async (req, res) => {
    // Our register logic starts here
    try {
      // Get user input
      const { username, phone, email, password } = req.body;

      // Validate user input
      if (!(email && password && username && phone)) {
        res.status(400).send("All input is required");
      }

      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await userSchema.findOne({ email });

      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }

      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);

      // Create user in our database
      const user = await userSchema.create({
        username,
        phone,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });

      // Create token
      const token = jwt.sign(
        { user_id: user._id, type: "user" },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;

      // return new user
      res.status(201).json(user.token);
    } catch (err) {
      console.log(err);
    }
  },
  getTest: (req, res, next) => {
    res.status(200).json({
      message: "test ok",
    });
  },
};
