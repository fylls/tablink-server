// dependencies
const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// input validator
const { check, validationResult } = require("express-validator")

// JWT secret
require("dotenv").config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

// database
const User = require("../../models/User")

// exporting
module.exports = router

/*=============================    U   S   E   R   =============================*/

/**
 *
 * @route   POST api/user/signIn
 * @desc    authenticate user & get token
 * @access  public
 *
 * @body    email . password
 *
 */

const signInOptions = [
  check("email", "Please include a valid email").exists(),
  check("password", "password is requiered").exists(),
]

router.post("/signIn", signInOptions, async (req, res) => {
  // check for errors in Body
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json(errors.array())

  // object destructuring from BODY
  const { email, password } = req.body

  try {
    let user = await User.findOne({ email })

    // check if user exists (user is identified by email)
    if (!user) return res.status(400).json("Invalid Credentials")

    // check if password is correct
    // password         =>      given by user in req.body
    // user.password    =>      hashed password stored in DB
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json("Invalid Credentials")

    // get the payload (._id without mongoose)
    const payload = { user: { id: user.id } }

    // return token
    jwt.sign(
      payload,

      JWT_SECRET_KEY,

      { expiresIn: 3600000 },

      (err, token) => {
        if (err) throw err
        res.json({ token })
      }
    )

    console.log("user logged")
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})
