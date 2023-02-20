const mongoose = require('mongoose')

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  note: {
    type: String,
    required: true
  },
  moduleVideo: {
    type: String,
    required: true
  }
})

const subscriberSchema = new mongoose.Schema({
  subscriber: { type: mongoose.Types.ObjectId, ref: 'user', required: true }
})

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
  modules: {
    type: [moduleSchema]
  },
  instructorID: {
    type: mongoose.Types.ObjectId,
    ref: 'instructor',
    required: true
  },
  adminVerification: {
    type: String,
    default: 'pending'
  },
  subscribers: {
    type: [subscriberSchema]
  }
})

module.exports = mongoose.model('course', courseSchema)
