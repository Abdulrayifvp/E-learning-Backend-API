const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const adminSchema = require('../models/admin')

module.exports = {
  postLogin: async (req, res) => {
    try {
      // Get admin input
      const { email, password } = req.body

      // Validate if admin exist in our database
      const admin = await adminSchema.findOne({ email })

      if (admin && (await bcrypt.compare(password, admin.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: admin._id, type: 'admin' },
          process.env.TOKEN_KEY,
          {
            expiresIn: '2h'
          }
        )
        // save admin token
        admin.token = token

        // send admin success response
        res.status(200).json(admin.token)
      } else {
        res.status(401).send('Invalid Credentials')
      }
    } catch (err) {
      console.log(err)
    }
  }
}
