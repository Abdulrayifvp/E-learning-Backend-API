const express = require('express')
const router = express.Router()
const instructorControls = require('../controllers/instructor')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = file.fieldname.startsWith('thumbnail') ? 'public/thumbnails' : 'public/previewVideos'
    cb(null, folder)
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.')
    )
    cb(null, file.fieldname + '-' + Date.now() + ext)
  }
})

const upload = multer({ storage })
// const auth = require('../middlewares/authentication.js')

router.post('/register', instructorControls.postRegister)

router.post('/login', instructorControls.postLogin)

router.post('/courses/addCourse', upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'previewVideo', maxCount: 1 }]), instructorControls.postAddCourse)

module.exports = router
