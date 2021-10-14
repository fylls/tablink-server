// Dependencies
const express = require("express")
const router = express.Router()

// Database
const Restaurant = require("../../models/Restaurant")

// Exporting
module.exports = router

//                      BASE: /api/restaurants

/*=====================  R E S T A U R A N T  =====================*/

/**
 *
 * @route   GET api/restaurants
 * @desc    Get all restaurants
 * @access  Public
 *
 */

router.get("/", async (req, res) => {
  try {
    const restaurant = await Restaurant.find()
    res.json(restaurant)
    console.log("Lista di tutti i ristoranti")
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})
