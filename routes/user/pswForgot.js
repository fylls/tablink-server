// Dependencies
const express = require("express")
const router = express.Router()

// Database
const User = require("../../models/User")
const ResetPsw = require("../../models/ResetPSW")

// Email
const sendResetLink = require("../../../config/mail/resetPassword")

// Exporting
module.exports = router

/*=============================    F O R G O T   =============================*/

/**
 *
 * @route   POST api/user/forgot
 * @desc    user has forgotten psw
 * @access  Public
 *
 * @body    email
 *
 */

router.post("/", async (req, res) => {
  // Check for Errors in Body
  userEmail = req.body.email
  if (!userEmail) return res.status(500).send("invalid email")

  // Check if User Exists
  // if not, for security reasons we will send "Invalid Credentials" in both cases

  try {
    // Check if Email is Correct
    // if there is no user => wrong email
    let user = await User.findOne({ userEmail })
    if (!user) return res.status(500).send("invalid email")

    const request = new ResetPsw({ email: userEmail })
    await request.save()

    // send Email
    sendResetLink(request.email, request.id)

    console.log("richiesta inviata")
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})
