// dependencies
const express = require("express")
const router = express.Router()

// input validator
const { check, validationResult } = require("express-validator")

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
 * @route   DELETE api/restaurants/:restID
 * @desc    delete restaurants by ID and delete ID in user
 * @access  private
 *
 * @header  x-auth-token
 * @params  :restID
 *
 */

router.delete("/:restID", auth, async (req, res) => {
  try {
    // check if restaurant exists
    const restaurant = await Restaurant.findById(req.params.restID)
    if (!restaurant) return res.status(404).json("restaurant not found")

    // check if the user owning the restaurant is the one deleting it
    if (restaurant.user.toString() !== req.user.id) return res.status(401).json("user not authorized")

    // remove restId from user.restaurant in DB
    const restUser = await User.findById(req.user.id)
    const removeIndex = restUser.restaurants.indexOf(req.params.restID)
    restUser.restaurants.splice(removeIndex, 1)

    // remove restaurant
    await restaurant.remove()
    await restUser.save()
    res.json("restaurant removed")
    console.log("restaurant removed")
  } catch (error) {
    console.error(error.message)
    if (error.kind === "ObjectId") return res.status(500).json("restaurant not found")
    res.status(500).send("Server Error")
  }
})
