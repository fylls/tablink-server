// Dependencies
const express = require("express")
const router = express.Router()

// Middleware
const auth = require("../../middleware/auth")

// Database
const User = require("../../models/User")
const Restaurant = require("../../models/Restaurant")

// Exporting
module.exports = router

/*=============================    R E S T A U R A N T    =============================*/

/**
 *
 * @route   GET api/restaurants/me
 * @desc    Get current users restaurant
 * @access  Private
 *
 * @header  x-auth-token
 *
 */

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")

    // get all the IDs of the restaurants associated with User
    // and Return to res an array with all the restaurants
    let restaurantsArray = []

    const restIDs = user.restaurants

    async function getRestaurants() {
      for (const restID of restIDs) {
        const rest = await Restaurant.findById(restID)
        restaurantsArray.unshift(rest)
      }
    }

    await getRestaurants()

    if (!restaurantsArray) {
      res.status(400).json({ msg: "there is no restaurant for this user" })
    }

    res.json(restaurantsArray)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})
