const express = require('express')
const app = express()
const path = require('path')
const logger = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

// middlewares
app.use(express.static(path.join(__dirname, 'public')))
app.use(logger('dev'))
require('dotenv/config')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// cors

const corsOption = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}
app.use(cors(corsOption))

// server setup
app.listen(process.env.PORT, () => {
  console.log('Sever is Running  http://localhost' + process.env.PORT)
})

// database setup
mongoose.set('strictQuery', false)
mongoose.connect(process.env.CONNECTION_STRING).then(() => {
  console.log('Database Connnected')
})

const userRouter = require('./routes/user.js')
const instructorRouter = require('./routes/instructor.js')
const adminRouter = require('./routes/admin.js')

// router middlewares
app.use('/', userRouter)
app.use('/admin', adminRouter)
app.use('/instructor', instructorRouter)

// error handling
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app
