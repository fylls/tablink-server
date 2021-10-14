// Dependencies
const express = require("express")
const router = express.Router()

// Input Validator
const { check, validationResult } = require("express-validator")

// Middleware
const auth = require("../../middleware/auth")

// Database
const Restaurant = require("../../models/Restaurant")
const User = require("../../models/User")
const Order = require("../../models/Order")

// Exporting
module.exports = router

/*=====================  O  R  D  E  R  S  =====================*/

/**
 *
 * @route   POST api/orders
 * @desc    Create an Order
 * @access  Public
 *
 */

const restaurantOptions = [
  check("restaurantId", "please specify restaurantId").not().isEmpty(),
  check("user", "please specify user").not().isEmpty(),
  check("customerName", "please specify customerName").not().isEmpty(),
  check("items", "please specify items").not().isEmpty(),
  check("totalPrice", "please specify totalPrice").not().isEmpty(),
]

router.post("/", restaurantOptions, async (req, res) => {
  // Check for Errors in Body
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  // Check if Restaurant Exists
  const restaurant = await Restaurant.findById(req.body.restaurantId)
  if (!restaurant) {
    return res.status(400).json({ msg: "Restaurant does not exist" })
  }

  try {
    const itemsArray = req.body.items

    // throw error if something is missing in the item Object
    for (const item of itemsArray) {
      if (!item.dishId || !item.name || !item.price || !item.quantity) {
        return res.status(400).json({
          msg: "either dishId or name or price or quantity is missing ",
        })
      }
    }

    // calculate the price of the whole order
    let totalItemsPrice = 0
    for (const item of itemsArray) totalItemsPrice += item.price * item.quantity

    if (totalItemsPrice === 0) {
      return res.status(400).json({ msg: "price is missing" })
    }

    // if the front-end has done the calculations right
    if (totalItemsPrice === parseInt(req.body.totalPrice)) {
      const newOrder = new Order({
        restaurantId: req.body.restaurantId,
        user: req.body.user,
        customerName: req.body.customerName,
        items: itemsArray,
        totalPrice: totalItemsPrice,
      })

      // Add tableNumber if Available
      const tableNumber = req.body.tableNumber
      if (tableNumber) newOrder.tableNumber = tableNumber

      await newOrder.save()
      res.json(newOrder)

      console.log("nuovo ordine")
    } else {
      return res
        .status(400)
        .json({ msg: "prices are different, order not possible" })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})
