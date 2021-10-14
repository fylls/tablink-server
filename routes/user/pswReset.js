// Dependencies
const express = require("express")
const router = express.Router()

// Database
const User = require("../../models/User")
const ResetPsw = require("../../models/ResetPSW")

// Email
const sendResetLink = require("../../config/resetPassword")

// Exporting
module.exports = router

/*=============================    F O R G O T   =============================*/

/**
 *
 * @route   POST api/user/reset
 * @desc    user can reset his psw
 * @access  Public
 *
 * @body    email
 *
 */

const pswResetOptions = [
  check("email", "Please include a valid email").exists(),
  check("id", "id is requiered").exists(),
]

router.put("/", pswResetOptions, async (req, res) => {
  // Check for Errors in Body
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  // Check if Request Exists
  const request = ResetPsw.findById(req.body._id)
  if (!request) return res.status(500).send("invalid request")

  try {
    // Check if Email is Correct
    // if there is no user => wrong email
    let user = await User.findOne({ userEmail })
    if (!user) return res.status(500).send("invalid email")

    // Encrypt Password
    const hashed = await bcrypt.hash(req.body.password, 12)
    user.password = hashed

    // Save User to DB
    await user.save()

    // Get the Payload => userID
    // without Mongoose  id: user._id
    const payload = { user: { id: user.id } }

    // Remove PSW
    const thisUser = JSON.parse(JSON.stringify(user))
    delete thisUser.password

    // Return JsonWebToken
    jwt.sign(
      payload,

      JWT_SECRET_KEY,

      { expiresIn: 36000 },

      (err, token) => {
        if (err) throw err
        res.json({ token, user: thisUser })
      }
    )

    // update successful request
    request.success = true
    await request.save()

    console.log("password aggiornata")
  } catch (err) {
    console.error(err.message)

    request.success = false
    await request.save()

    res.status(500).send("Server error")
  }
})

router.patch("/reset", (req, res) => {
  const thisRequest = getResetRequest(req.body.id)
  if (thisRequest) {
    const user = getUser(thisRequest.email)
    bcrypt.hash(req.body.password, 10).then(hashed => {
      user.password = hashed
      updateUser(user)
      res.status(204).json()
    })
  } else {
    res.status(404).json()
  }
})
