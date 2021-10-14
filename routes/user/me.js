// dependencies
const express = require("express")
const router = express.Router()

// database
const User = require("../../models/User")

// middleware
const auth = require("../../utils/auth")

// exporting
module.exports = router

/*=============================    U   S   E   R   =============================*/

/**
 *
 * @route   GET api/user/me
 * @desc    get user info
 * @access  private
 *
 * @header  x-auth-token
 *
 */

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (user) res.json(user)
    else return res.status(418).json("invalid token")
    console.log("user data")
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})
