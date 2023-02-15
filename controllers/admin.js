const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const courseSchema = require('../models/course')

const adminSchema = require('../models/admin')

module.exports = {
  postLogin: async (req, res) => {
    try {
      // Get admin input
      const { email, password } = req.body

      // Validate if admin exist in our database
      const admin = await adminSchema.findOne({ email })

      if (admin && (await bcrypt.compare(password, admin.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: admin._id, type: 'admin' },
          process.env.TOKEN_KEY,
          {
            expiresIn: '2d'
          }
        )
        // save admin token
        admin.token = token

        // send admin success response
        res.status(200).json(admin.token)
      } else {
        res.status(401).send('Invalid Credentials')
      }
    } catch (err) {
      console.log(err)
    }
  },
  getAllCourses: (req, res, next) => {
    try {
      courseSchema.find().then((courses) => {
        res.status(200).json(courses.reverse())
      })
    } catch (err) {
      console.log(err)
    }
  },
  getVerifiedCourses: (req, res, next) => {
    try {
      courseSchema.find({ adminVerification: 'verified' }).then((courses) => {
        res.status(200).json(courses.reverse())
      })
    } catch (err) {
      console.log(err)
    }
  },
  getVerifingCourses: (req, res, next) => {
    try {
      courseSchema.find({ adminVerification: 'verifing' }).then((courses) => {
        res.status(200).json(courses.reverse())
      })
    } catch (err) {
      console.log(err)
    }
  },
  getPendingCourses: (req, res, next) => {
    try {
      courseSchema.find({ adminVerification: 'pending' }).then((courses) => {
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

  changeCourseVerificationStatus: (req, res, next) => {
    try {
      courseSchema.findByIdAndUpdate(req.params.id, { adminVerification: req.params.status }).then((result) => {
        res.status(200)
      })
    } catch (err) {
      console.log(err)
    }
  }
}
