const multer = require('multer')

module.exports.upload = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname.startsWith('thumbnail')) {
        const folder = 'public/thumbnails'
        cb(null, folder)
      } else if (file.fieldname.startsWith('previewVideo')) {
        const folder = 'public/previewVideos'
        cb(null, folder)
      } else if (file.fieldname.startsWith('note')) {
        const folder = 'public/notes'
        cb(null, folder)
      } else if (file.fieldname.startsWith('moduleVideo')) {
        const folder = 'public/moduleVideos'
        cb(null, folder)
      }
    },
    onError: function (err, next) {
      console.log('error', err)
      next(err)
    },
    filename: function (req, file, cb) {
      const ext = file.originalname.substring(
        file.originalname.lastIndexOf('.')
      )
      cb(null, file.fieldname + '-' + Date.now() + ext)
    }
  })
  return multer({ storage })
}
