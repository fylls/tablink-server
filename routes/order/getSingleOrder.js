// Dependencies
const express = require("express")
const router = express.Router()

// Middleware
const auth = require("../../middleware/auth")

// Database
const Order = require("../../models/Order")

// Exporting
module.exports = router

/*=====================  O  R  D  E  R  S  =====================*/

/**
 *
 * @route   GET api/orders/:orderID
 * @desc    Create an Order
 * @access  Private
 *
 */

router.get("/:orderID", auth, async (req, res) => {
  try {
    // Check if Order Exists
    const order = await Order.findById(req.params.orderID)
    if (!order) {
      return res.status(404).json({ msg: "order not found" })
    }

    // Check if the User Owning the Restaurant is the one Accessing its info
    // restaurant.user (ObjectId) , req.user.id (String)
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "user not authorized" })
    }

    res.json(order)

    console.log("ordine ricercato")
  } catch (error) {
    console.error(error.message)

    if (error.kind === "ObjectId") {
      return res.status(500).json({ msg: "Restaurant not found" })
    }

    res.status(500).send("Server Error")
  }
})
