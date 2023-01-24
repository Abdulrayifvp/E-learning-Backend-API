const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const instructorSchema = require("../models/instructor");

module.exports = {
  postLogin: async (req, res) => {
    try {
      // Get instructor input
      const { email, password } = req.body;

      // Validate if instructor exist in our database
      const instructor = await instructorSchema.findOne({ email });
      if (instructor && (await bcrypt.compare(password, instructor.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: instructor._id, type: "instructor" },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );

        // save instructor token
        instructor.token = token;

        // user
        res.status(200).json(instructor.token);
      } else {
        res.status(401).send("Invalid Credentials");
      }
    } catch (err) {
      console.log(err);
    }
  },
  postRegister: async (req, res) => {
    try {
      // Get instructor input
      const { username, phone, email, password } = req.body;

      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await instructorSchema.findOne({ email });

      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }

      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);

      // Create instructor in our database
      const instructor = await instructorSchema.create({
        username,
        phone,
        email: email.toLowerCase(),
        password: encryptedPassword,
      });

      // Create token
      const token = jwt.sign(
        { user_id: instructor._id, type: "instructor" },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save instructor token
      instructor.token = token;

      // return new instructor success
      res.status(200).json(instructor.token);
    } catch (err) {
      console.log(err);
    }
  },
};
