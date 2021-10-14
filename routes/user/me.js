// Dependencies
const express = require("express")
const router = express.Router()

// Database
const User = require("../../models/User")

// Middleware for Auth
const auth = require("../../utils/auth")

// Exporting
module.exports = router

/*=============================    U   S   E   R   =============================*/

/**
 *
 * @route   GET api/user/me
 * @desc    get user info
 * @access  Private
 *
 * @header  x-auth-token
 *
 */

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (user) res.json(user)
    else return res.status(418).json({ msg: "invalid token" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})
