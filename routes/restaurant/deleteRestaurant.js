// Dependencies
const express = require("express")
const router = express.Router()

// Input Validator
const { check, validationResult } = require("express-validator")

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
 * @route   DELETE api/restaurants/:restID
 * @desc    Delete Restaurants by ID and Delete ID in user
 * @access  Private
 *
 * @header  x-auth-token
 * @params  :restID
 *
 */

router.delete("/:restID", auth, async (req, res) => {
  try {
    // Check if Restaurant Exists
    const restaurant = await Restaurant.findById(req.params.restID)
    if (!restaurant) {
      return res.status(404).json({ msg: "restaurant not found" })
    }

    // Check if the User Owning the Restaurant is the one Deleting it
    // restaurant.user (ObjectId) , req.user.id (String)
    if (restaurant.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "user not authorized" })
    }

    // Remove restId from user.restaurant in DB
    const restUser = await User.findById(req.user.id)
    const removeIndex = restUser.restaurants.indexOf(req.params.restID)
    restUser.restaurants.splice(removeIndex, 1)

    // Removing
    await restaurant.remove()
    await restUser.save()

    res.json({ msg: "restaurant Removed" })
  } catch (error) {
    console.error(error.message)

    if (error.kind === "ObjectId") {
      return res.status(500).json({ msg: "Restaurant not found" })
    }

    res.status(500).send("Server Error")
  }
})
