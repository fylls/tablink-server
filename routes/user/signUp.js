// Dependencies
const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Input Validator
const { check, validationResult } = require("express-validator")

// JWT Secret
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

// Database
const User = require("../../models/User")

// Stripe for payments
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

// Exporting
module.exports = router

/*=============================    U   S   E   R   =============================*/

/**
 *
 * @route   POST api/user/signUp
 * @desc    Register User
 * @access  Public
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

router.post("/", signUpOptions, async (req, res) => {
  // Check for Errors in Body (something is missing)
  const errors = validationResult(req.body)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  // Check if User Already Exists
  const { name, email, phone, password } = req.body

  try {
    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] })
    }

    // Encrypt Password
    const hashed = await bcrypt.hash(password, 12)

    // Create Stripe Costumer
    const customer = await stripe.customers.create({ email })

    // Create new User
    const newUser = new User({
      name,
      email,
      phone,
      password: hashed,
      customerId: customer.id,
    })

    // Save User to DB
    await newUser.save()

    // Get the Payload => userID
    // without Mongoose  id: user._id
    const payload = { user: { id: newUser.id } }

    // Remove PSW
    delete newUser.password

    // Return JsonWebToken
    jwt.sign(
      payload,

      JWT_SECRET_KEY,

      { expiresIn: 36000 },

      (err, token) => {
        if (err) throw err
        res.json({ token, user: newUser })
      }
    )

    console.log("Utente Registrato")
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})
