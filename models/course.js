const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  previewVideo: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  prize: {
    type: String,
    required: true
  },
  offerPrize: {
    type: String,
    required: true
  },
  adminVerification: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('course', courseSchema)
