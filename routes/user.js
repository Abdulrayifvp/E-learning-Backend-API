const express = require('express')
const router = express.Router()
const userControls = require('../controllers/user')
const auth = require('../middlewares/authentication.js')

router.post('/register', userControls.postRegister)

router.post('/login', userControls.postLogin)

router.get('/courses/all', userControls.getAllCourses)

router.get('/courses/:id', auth, userControls.getCourseById)

router.post('/createOrder', auth, userControls.createOrder)

router.post('/paymentSuccess', auth, userControls.paymentSuccess)

router.get('/purchasedCourses', auth, userControls.getPurchasedCourses)

router.get('/purchasedCoursesDetailed', auth, userControls.getPurchasedCoursesDetailed)

module.exports = router
