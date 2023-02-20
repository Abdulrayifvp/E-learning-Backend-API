const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')

const instructorSchema = require('../models/instructor')
const courseSchema = require('../models/course')

module.exports = {
  postLogin: async (req, res, next) => {
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
        res.status(200).json({ token: instructor.token, status: true })
      } else {
        res.status(200).json({ status: false, message: 'Invalid Credentials' })
      }
    } catch (err) {
      next(err)
    }
  },
  postRegister: async (req, res, next) => {
    try {
      // Get instructor input
      const { username, phone, email, password } = req.body

      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await instructorSchema.findOne({ email })

      if (oldUser) {
        return res
          .status(200)
          .json({ status: false, message: 'User Already Exist. Please Login' })
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
      res.status(200).json({ token: instructor.token, status: true })
    } catch (err) {
      next(err)
    }
  },

  postAddCourse: async (req, res, next) => {
    try {
      // decode Token
      const token = await jwt.verify(
        req.body.instructorToken,
        process.env.TOKEN_KEY
      )

      // create a course
      await courseSchema.create({
        _id: new mongoose.Types.ObjectId(),
        instructorID: token.user_id,
        title: req.body.title,
        description: req.body.description,
        thumbnail:
          process.env.UrlTOPublicFolder +
          'thumbnails/' +
          req.files.thumbnail[0].filename,
        previewVideo:
          process.env.UrlTOPublicFolder +
          'previewVideos/' +
          req.files.previewVideo[0].filename,
        level: req.body.level,
        prize: req.body.prize,
        offerPrize: req.body.offerPrize
      })

      // success
      res.status(200).json({
        success: true
      })
    } catch (err) {
      next(err)
    }
  },

  fetchCourse: async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decode = await jwt.verify(token, process.env.TOKEN_KEY)
    courseSchema
      .find({ instructorID: decode.user_id })
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
      .catch((error) => {
        next(error)
      })
  },
  getModule: (req, res, next) => {
    courseSchema.findById(req.params.id).then((result) => {
      result.modules.forEach((element) => {
        if (element.id === req.params.moduleId) {
          res.status(200).json({ element })
        }
      })
    })
  },

  addModule: async (req, res, next) => {
    try {
      const course = await courseSchema.findById(req.params.id)
      const module = {
        title: req.body.title,
        description: req.body.description,
        note:
          process.env.UrlTOPublicFolder + 'notes/' + req.files.note[0].filename,
        moduleVideo:
          process.env.UrlTOPublicFolder +
          'moduleVideos/' +
          req.files.moduleVideo[0].filename
      }
      course.modules.push(module)
      course
        .save()
        .then((result) => {
          res.status(200).json({ success: true })
        })
        .catch((error) => {
          next(error)
        })
    } catch (err) {
      next(err)
    }
  },
  getSubscribers: (req, res, next) => {
    courseSchema
      .findById(req.params.id)
      .populate('subscribers.subscriber')
      .then((result) => {
        const subscriber = []
        result.subscribers.forEach((element) => {
          const obj = {
            _id: element.subscriber._id,
            name: element.subscriber.username,
            email: element.subscriber.email,
            phone: element.subscriber.phone
          }
          subscriber.push(obj)
        })
        res.status(200).json(subscriber)
      })
  },
  editCourse: async (req, res, next) => {
    const course = await courseSchema.findById(req.params.id)
    course.title = req.body.title
    course.description = req.body.description
    if (req.files.thumbnail) {
      course.thumbnail =
        process.env.UrlTOPublicFolder +
        'thumbnails/' +
        req.files.thumbnail[0].filename
    }
    if (req.files.previewVideo) {
      course.previewVideo =
        process.env.UrlTOPublicFolder +
        'previewVideos/' +
        req.files.previewVideo[0].filename
    }
    course.level = req.body.level
    course.offerPrize = req.body.offerPrize
    course.prize = req.body.prize
    course.modules = JSON.parse(req.body.modules)
    course
      .save()
      .then((result) => {
        res.status(200).json({ status: true })
      })
      .catch((err) => {
        res.status(200).json({ status: false })
        next(err)
      })
  },
  editModule: async (req, res, next) => {
    const course = await courseSchema.findById(req.params.id)
    const index = course.modules.findIndex(
      (element) => element.id === req.params.moduleId
    )
    course.modules[index].title = req.body.title
    course.modules[index].description = req.body.description
    if (req.files.note) {
      course.modules[index].note =
        process.env.UrlTOPublicFolder + 'notes/' + req.files.note[0].filename
    }
    if (req.files.moduleVideo) {
      course.modules[index].moduleVideo =
        process.env.UrlTOPublicFolder +
        'moduleVideos/' +
        req.files.moduleVideo[0].filename
    }
    course.save().then((result) => {
      res.status(200).json({ status: true })
    })
  }
}
