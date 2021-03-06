// dependencies
const express = require("express")
const router = express.Router()

// database
const Restaurant = require("../../models/Restaurant")

// exporting
module.exports = router

//                      BASE: /api/restaurants

/*=====================  R E S T A U R A N T  =====================*/

/**
 *
 * @route   GET api/restaurants
 * @desc    get all restaurants
 * @access  public
 *
 */

router.get("/", async (req, res) => {
  try {
    const restaurant = await Restaurant.find()
    res.json(restaurant)
    console.log("All Restaurant")
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})
