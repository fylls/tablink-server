// Dependencies
const express = require("express")
const router = express.Router()

// Middleware
const auth = require("../../middleware/auth")

// Database
const Restaurant = require("../../models/Restaurant")

// Exporting
module.exports = router

/*=====================      M  E  N  U      =====================*/

/**
 *
 * @route   api/restaurants/:restID/menu/:dishID
 * @desc    Delete dish from restaurant
 * @access  Private
 *
 */

router.delete("/:restID/menu/:dishID", auth, async (req, res) => {
  try {
    // Check if Restaurant Exists
    const restaurant = await Restaurant.findById(req.params.restID)
    if (!restaurant) {
      return res.status(400).json({ msg: "restaurant not found" })
    }

    // Check if the User Owning the Restaurant is the one that Updates it
    // restaurant.user (ObjectId) , req.user.id (String)
    if (restaurant.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "user not authorized" })
    }

    // get remove index
    const removeIndex = restaurant.menu
      .map(item => item.id)
      .indexOf(req.params.dishID)

    // remove element
    restaurant.menu.splice(removeIndex, 1)

    // save to DB and send
    await restaurant.save()
    res.json(restaurant)

    console.log("elemento eliminato dal menu")
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})
