const mongoose = require('mongoose')

const purchasedCourse = new mongoose.Schema({
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: 'course',
    required: true
  }
})

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  purchasedCourse: {
    type: [purchasedCourse]
  },
  token: {
    type: String
  }
})

module.exports = mongoose.model('user', userSchema)
