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
            expiresIn: '2d'
          }
        )

        // save instructor token
        instructor.token = token

        // user
        res.status(200).json(instructor.token)
      } else {
        res.status(401).send({ message: 'Invalid Credentials' })
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
        return res.status(409).send({ message: 'User Already Exist. Please Login' })
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
          expiresIn: '2d'
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
      // decode Token
      const token = await jwt.verify(req.body.instructorToken, process.env.TOKEN_KEY)

      // create a course
      await courseSchema.create({
        _id: new mongoose.Types.ObjectId(),
        instructorID: token.user_id,
        title: req.body.title,
        description: req.body.description,
        thumbnail: process.env.UrlTOPublicFolder + 'thumbnails/' + req.files.thumbnail[0].filename,
        previewVideo: process.env.UrlTOPublicFolder + 'previewVideos/' + req.files.previewVideo[0].filename,
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
  },

  fetchCourse: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decode = await jwt.verify(token, process.env.TOKEN_KEY)
      courseSchema.find({ instructorID: decode.user_id }).then((courses) => {
        res.status(200).json(courses.reverse())
      })
    } catch (err) {
      console.log(err)
    }
  },

  getCourseById: (req, res, next) => {
    try {
      courseSchema.findById(req.params.id).then((course) => {
        res.status(200).json(course)
      })
    } catch (err) {
      console.log(err)
    }
  },

  addModule: async (req, res, next) => {
    try {
      const course = await courseSchema.findById(req.params.id)
      const module = {
        title: req.body.title,
        description: req.body.description,
        note: process.env.UrlTOPublicFolder + 'notes/' + req.files.note[0].filename,
        moduleVideo: process.env.UrlTOPublicFolder + 'moduleVideos/' + req.files.moduleVideo[0].filename
      }
      course.modules.push(module)
      course.save().then(result => {
        res.status(200).json({ success: true })
      })
    } catch (err) {
      console.log(err)
    }
  }
}
