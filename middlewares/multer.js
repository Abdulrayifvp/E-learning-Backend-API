const multer = require('multer')

module.exports.upload = (path) => {
  const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `public/${path}`)
    },
    filename: function (req, file, cb) {
      const ext = file.originalname.substring(
        file.originalname.lastIndexOf('.')
      )
      cb(null, file.fieldname + '-' + Date.now() + ext)
    },
    onError: function (err, next) {
      console.log('error', err)
      next(err)
    }
  })
  return multer({ storage: Storage })
}
