const express = require('express')
const router = express.Router()
const instructorControls = require('../controllers/instructor')
const multer = require('../middlewares/multer')
const auth = require('../middlewares/authentication')
const upload = multer.upload()

router.post('/register', instructorControls.postRegister)

router.post('/login', instructorControls.postLogin)

router.post('/courses/addCourse', auth, upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'previewVideo', maxCount: 1 }]), instructorControls.postAddCourse)

router.get('/courses/', auth, instructorControls.fetchCourse)

router.get('/courses/:id', auth, instructorControls.getCourseById)

router.post('/courses/:id/addModule', auth, upload.fields([{ name: 'note', maxCount: 1 }, { name: 'moduleVideo', maxCount: 1 }]), instructorControls.addModule)

module.exports = router
