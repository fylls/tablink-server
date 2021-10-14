// Dependencies
const express = require("express")
const router = express.Router()

// Middleware
const auth = require("../../utils/auth")

// Input Validator
const { check, validationResult } = require("express-validator")

// Database
const Order = require("../../models/Order")

// Exporting
module.exports = router

/*=====================  O  R  D  E  R  S  =====================*/

/**
 *
 * @route   PUT api/orders/:orderID
 * @desc    Update an Order
 * @access  Private
 *
 * @body    served : Boolean
 *
 */

const servedOrderOprions = [
  check("served", "please specify if served").not().isEmpty(),
]

router.put("/:orderID", [auth, servedOrderOprions], async (req, res) => {
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

    // Update Order: Server or not?
    order.served = req.body.served
    await order.save()
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
