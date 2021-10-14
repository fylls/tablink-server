// dependencies
const express = require("express")
const router = express.Router()

// middleware
const auth = require("../../utils/auth")

// database
const User = require("../../models/User")
const Restaurant = require("../../models/Restaurant")

// exporting
module.exports = router

/*=============================    R E S T A U R A N T    =============================*/

/**
 *
 * @route   GET api/restaurants/me
 * @desc    get current users restaurant
 * @access  private
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

    if (!restaurantsArray) res.status(400).json("there is no restaurant for this user")
    res.json(restaurantsArray)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})
