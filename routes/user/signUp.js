// dependencies
const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// input validator
const { check, validationResult } = require("express-validator")

// JWT secret
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

// database
const User = require("../../models/User")

// exporting
module.exports = router

/*=============================    U   S   E   R   =============================*/

/**
 *
 * @route   POST api/user/signUp
 * @desc    Register User
 * @access  public
 *
 * @body    name . email . phone . password
 *
 */

const signUpOptions = [
  check("name", "Name is required").not().isEmpty(),
  check("phone", "Phone is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("password", "password must be longer than 6 characters ").isLength({
    min: 6,
  }),
]

router.post("/signUp", signUpOptions, async (req, res) => {
  // check for errors in body
  const errors = validationResult(req.body)
  if (!errors.isEmpty()) return res.status(400).json(errors.array())

  // object destructuring from BODY
  const { name, email, phone, password } = req.body

  try {
    let user = await User.findOne({ email })

    // check if user already exists
    if (user) return res.status(400).json("User already exists")

    // encrypt password
    const hashed = await bcrypt.hash(password, 12)

    // create new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashed,
    })

    // save user to DB
    await newUser.save()

    // get the payload (._id without mongoose)
    const payload = { user: { id: newUser.id } }

    // remove PSW
    delete newUser.password

    // return token
    jwt.sign(
      payload,

      JWT_SECRET_KEY,

      { expiresIn: 36000 },

      (err, token) => {
        if (err) throw err
        res.json({ token, user: newUser })
      }
    )

    console.log("user signed up")
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})
