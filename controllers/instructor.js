const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')

const instructorSchema = require('../models/instructor')
const courseSchema = require('../models/course')

module.exports = {
  postLogin: async (req, res) => {
    try {
      // Get instructor input
      const { email, password } = req.body

      // Validate if instructor exist in our database
      const instructor = await instructorSchema.findOne({ email })
      if (instructor && (await bcrypt.compare(password, instructor.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: instructor._id, type: 'instructor' },
          process.env.TOKEN_KEY,
          {
            expiresIn: '2h'
          }
        )

        // save instructor token
        instructor.token = token

        // user
        res.status(200).json(instructor.token)
      } else {
        res.status(401).send('Invalid Credentials')
      }
    } catch (err) {
      console.log(err)
    }
  },
  postRegister: async (req, res) => {
    try {
      // Get instructor input
      const { username, phone, email, password } = req.body

      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await instructorSchema.findOne({ email })

      if (oldUser) {
        return res.status(409).send('User Already Exist. Please Login')
      }

      // Encrypt user password
      const encryptedPassword = await bcrypt.hash(password, 10)

      // Create instructor in our database
      const instructor = await instructorSchema.create({
        username,
        phone,
        email: email.toLowerCase(),
        password: encryptedPassword
      })

      // Create token
      const token = jwt.sign(
        { user_id: instructor._id, type: 'instructor' },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h'
        }
      )
      // save instructor token
      instructor.token = token

      // return new instructor success
      res.status(200).json(instructor.token)
    } catch (err) {
      console.log(err)
    }
  },

  postAddCourse: async (req, res) => {
    try {
      // create a course
      await courseSchema.create({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        thumbnail: req.files.thumbnail[0].filename,
        previewVideo: req.files.previewVideo[0].filename,
        level: req.body.level,
        prize: req.body.prize,
        offerPrize: req.body.offerPrize
      })

      // success
      res.status(200).json({
        success: true
      })
    } catch (err) {
      console.log(err)
    }
  }
}
