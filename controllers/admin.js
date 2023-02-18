const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const courseSchema = require('../models/course')

const adminSchema = require('../models/admin')

module.exports = {
  postLogin: async (req, res, next) => {
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
        res.status(200).json({ token: admin.token, status: true })
      } else {
        res.status(200).json({ status: false, message: 'Invalid Credentials' })
      }
    } catch (err) {
      next(err)
    }
  },
  getAllCourses: (req, res, next) => {
    courseSchema
      .find()
      .then((courses) => {
        res.status(200).json(courses.reverse())
      })
      .catch((err) => {
        next(err)
      })
  },
  getVerifiedCourses: (req, res, next) => {
    courseSchema
      .find({ adminVerification: 'verified' })
      .then((courses) => {
        res.status(200).json(courses.reverse())
      })
      .catch((err) => {
        next(err)
      })
  },
  getVerifingCourses: (req, res, next) => {
    courseSchema
      .find({ adminVerification: 'verifing' })
      .then((courses) => {
        res.status(200).json(courses.reverse())
      })
      .catch((err) => {
        next(err)
      })
  },
  getPendingCourses: (req, res, next) => {
    courseSchema
      .find({ adminVerification: 'pending' })
      .then((courses) => {
        res.status(200).json(courses.reverse())
      })
      .catch((err) => {
        next(err)
      })
  },
  getCourseById: (req, res, next) => {
    courseSchema
      .findById(req.params.id)
      .then((course) => {
        if (course != null) {
          res.status(200).json(course)
        } else {
          res.status(400).json({ error: 'not found' })
        }
      })
      .catch((err) => {
        next(err)
      })
  },

  changeCourseVerificationStatus: (req, res, next) => {
    courseSchema
      .findByIdAndUpdate(req.params.id, {
        adminVerification: req.params.status
      })
      .then((result) => {
        res.status(200)
      })
      .catch((err) => {
        next(err)
      })
  }
}
