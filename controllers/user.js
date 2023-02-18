const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = require('../models/user.js')
const courseSchema = require('../models/course')
const Razorpay = require('razorpay')

const {
  validatePaymentVerification
} = require('../node_modules/razorpay/dist/utils/razorpay-utils')
const instance = new Razorpay({
  key_id: 'rzp_test_RgCVtBX18ATpsX',
  key_secret: 'BP4nQyEcQBj7EIWrKHxPfzMY'
})

module.exports = {
  postLogin: async (req, res) => {
    try {
      // Get user input
      const { email, password } = req.body

      // Validate if user exist in our database
      const user = await userSchema.findOne({ email })

      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, type: 'user' },
          process.env.TOKEN_KEY,
          {
            expiresIn: '2d'
          }
        )

        // save user token
        user.token = token

        // user
        res.status(200).json({ token: user.token, status: true })
      } else {
        res.status(200).json({ status: false, message: 'Invalid Credentials' })
      }
    } catch (err) {
      console.log(err)
    }
  },
  postRegister: async (req, res, next) => {
    try {
      // Get user input
      const { username, phone, email, password } = req.body

      // Validate user input
      if (!(email && password && username && phone)) {
        res.status(400).send('All input is required')
      }

      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await userSchema.findOne({ email })

      if (oldUser) {
        return res
          .status(200)
          .json({ status: false, message: 'User Already Exist. Please Login' })
      }

      // Encrypt user password
      const encryptedPassword = await bcrypt.hash(password, 10)

      // Create user in our database
      const user = await userSchema.create({
        username,
        phone,
        email: email.toLowerCase(),
        password: encryptedPassword
      })

      // Create token
      const token = jwt.sign(
        { user_id: user._id, type: 'user' },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2d'
        }
      )
      // save user token
      user.token = token

      // return success
      res.status(200).json({ token: user.token, status: true })
    } catch (err) {
      next(err)
    }
  },
  getAllCourses: (req, res, next) => {
    courseSchema
      .find({ adminVerification: 'verified' })
      .then((courses) => {
        res.status(200).json(courses.reverse())
      })
      .catch((err) => {
        next(err)
      })
  },
  createOrder: (req, res, next) => {
    instance.orders
      .create({
        amount: req.body.amount * 100,
        currency: 'INR',
        receipt: 'receipt#1'
      })
      .then((result) => {
        res.status(200).json(result)
      })
      .catch((err) => {
        next(err)
      })
  },
  paymentSuccess: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = await jwt.verify(token, process.env.TOKEN_KEY)
      const paymentResponse = req.body.data
      const validationStatus = validatePaymentVerification(
        {
          order_id: paymentResponse.razorpay_order_id,
          payment_id: paymentResponse.razorpay_payment_id
        },
        paymentResponse.razorpay_signature,
        'BP4nQyEcQBj7EIWrKHxPfzMY'
      )
      if (validationStatus === true) {
        const user = await userSchema.findById(decoded.user_id)
        user.purchasedCourse.push({ courseId: req.body.courseId })
        user
          .save()
          .then(() => {
            res.status(200).json({ status: true })
          })
          .catch((err) => {
            next(err)
          })
      } else {
        res.status(400).json({ status: false })
      }
    } catch (err) {
      next(err)
    }
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

  getPurchasedCourses: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.TOKEN_KEY)
      userSchema
        .findById(decoded.user_id)
        .then((result) => {
          const purchasedCourses = []
          result.purchasedCourse.forEach((element) => {
            purchasedCourses.push(element.courseId)
          })
          res.status(200).json(purchasedCourses)
        })
        .catch((err) => {
          next(err)
        })
    } catch (err) {
      next(err)
    }
  },
  getPurchasedCoursesDetailed: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.TOKEN_KEY)
      userSchema
        .findById(decoded.user_id)
        .populate('purchasedCourse.courseId')
        .then((result) => {
          const purchasedCourses = []
          result.purchasedCourse.forEach((course) =>
            purchasedCourses.push(course.courseId)
          )
          res.status(200).json(purchasedCourses)
        })
        .catch((err) => {
          next(err)
        })
    } catch (err) {
      next(err)
    }
  }
}
