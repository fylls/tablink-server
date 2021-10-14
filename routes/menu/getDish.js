// Dependencies
const express = require("express")
const router = express.Router()

// Database
const Restaurant = require("../../models/Restaurant")

// Exporting
module.exports = router

/*=====================      M  E  N  U      =====================*/

/**
 *
 * @route   GET api/restaurants/:restID/menu/:dishID (of item)
 * @desc    Get dish by menuID
 * @access  Public
 *
 */

router.get("/:restID/menu/:dishID", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restID)

    if (!restaurant) {
      return res.status(400).json({ msg: "restaurant not found" })
    }

    // get index of dish-item
    const index = restaurant.menu
      .map(item => item.id)
      .indexOf(req.params.dishID)

    if (restaurant.menu[index]) {
      res.json(restaurant.menu[index])
    } else {
      return res.status(400).json({ msg: "dish not found" })
    }

    console.log("dish trovato")
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})
