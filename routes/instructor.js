const express = require('express')
const router = express.Router()
const instructorControls = require('../controllers/instructor')
const multer = require('../middlewares/multer')
const auth = require('../middlewares/authentication')
const upload = multer.upload()

router.post('/register', instructorControls.postRegister)

router.post('/login', instructorControls.postLogin)

router.post(
  '/courses/addCourse',
  auth,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'previewVideo', maxCount: 1 }
  ]),
  instructorControls.postAddCourse
)

router.get('/courses/', auth, instructorControls.fetchCourse)

router.get('/courses/:id', auth, instructorControls.getCourseById)

router.get('/subscribers/:id', auth, instructorControls.getSubscribers)

router.get('/course/:id/module/:moduleId', auth, instructorControls.getModule)

router.post(
  '/courses/:id/addModule',
  auth,
  upload.fields([
    { name: 'note', maxCount: 1 },
    { name: 'moduleVideo', maxCount: 1 }
  ]),
  instructorControls.addModule
)

router.post(
  '/courses/:id/editModule/:moduleId',
  auth,
  upload.fields([
    { name: 'note', maxCount: 1 },
    { name: 'moduleVideo', maxCount: 1 }
  ]),
  instructorControls.editModule
)

router.post(
  '/courses/editCourse/:id',
  auth,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'previewVideo', maxCount: 1 }
  ]),
  instructorControls.editCourse
)

module.exports = router
