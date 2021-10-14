// Dependencies
const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Input Validator
const { check, validationResult } = require("express-validator")

// JWT Secret
require("dotenv").config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

// Database
const User = require("../../models/User")

// Exporting
module.exports = router

/*=============================    U   S   E   R   =============================*/

/**
 *
 * @route   POST api/user/logIn
 * @desc    Authenticate user & get token
 * @access  Public
 *
 * @body    email . password
 *
 */

const logInOptions = [
  check("email", "Please include a valid email").exists(),
  check("password", "password is requiered").exists(),
]

router.post("/logIn", logInOptions, async (req, res) => {
  // Check for Errors in Body
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  // Check if User Exists
  // if not, for security reasons we will send "Invalid Credentials" in both cases
  const { email, password } = req.body

  try {
    let user = await User.findOne({ email })

    // Check if Email is Correct
    // if there is no user => wrong email
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] })
    }

    // Check if Password is Correct
    // password         =>      given by user in req.body
    // user.password    =>      hashed password fetch from DB
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] })
    }

    // get the payload => userID
    // without  mongoose  id: user._id
    const payload = { user: { id: user.id } }

    // return JsonWebToken
    jwt.sign(
      payload,

      JWT_SECRET_KEY,

      { expiresIn: 3600000 },

      (err, token) => {
        if (err) throw err
        res.json({ token })
      }
    )

    console.log("User Loggato")
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})
