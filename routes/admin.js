const express = require('express')
const router = express.Router()
const adminControl = require('../controllers/admin')
const auth = require('../middlewares/authentication.js')

router.post('/login', adminControl.postLogin)

router.get('/courses/all', auth, adminControl.getAllCourses)

router.get('/courses/verifing', auth, adminControl.getVerifingCourses)

router.get('/courses/verified', auth, adminControl.getVerifiedCourses)

router.get('/courses/pending', auth, adminControl.getPendingCourses)

router.get('/courses/:id', auth, adminControl.getCourseById)

router.get('/courses/changeStatus/:id/:status', auth, adminControl.changeCourseVerificationStatus)

module.exports = router
