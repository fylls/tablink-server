// Dependencies
const express = require("express")
const router = express.Router()

// Middleware
const auth = require("../../middleware/auth")

// Database
const Restaurant = require("../../models/Restaurant")
const Order = require("../../models/Order")

// Exporting
module.exports = router

/*=====================  O  R  D  E  R  S  =====================*/

/**
 *
 * @route   GET api/orders/restaurants/:restID
 * @desc    Get all orders of a Restaurant
 * @access  Private
 *
 */

router.get("/restaurants/:restID", auth, async (req, res) => {
  try {
    // Check if Restaurant Exists
    const restaurant = await Restaurant.findById(req.params.restID)
    if (!restaurant) {
      return res.status(404).json({ msg: "restaurant not found" })
    }

    // Check if the User Owning the Restaurant is the one Accessing its info
    // restaurant.user (ObjectId) , req.user.id (String)
    if (restaurant.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "user not authorized" })
    }

    // Get all Order of the restaurant
    const orders = await Order.find({ restaurantId: req.params.restID })
    res.json(orders)

    console.log("Lista di tutti gli ordini di un ristorante")
  } catch (error) {
    console.error(error.message)

    if (error.kind === "ObjectId") {
      return res.status(500).json({ msg: "Restaurant not found" })
    }

    res.status(500).send("Server Error")
  }
})
