// Dependencies
const express = require("express")
const router = express.Router()

// Database
const Restaurant = require("../../models/Restaurant")

// Exporting
module.exports = router

/*=============================    R E S T A U R A N T    =============================*/

/**
 *
 * @route   GET api/restaurants/search/:restID
 * @desc    Get restaurant by restID
 * @access  Public
 *
 * @params  :restID
 */

router.get("/search/:restID", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restID)

    if (!restaurant) {
      return res.status(400).json({ msg: "restaurant not found" })
    }

    res.json(restaurant)
    console.log("Ristorante trovato")
  } catch (err) {
    console.error(err.message)

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "restaurant not found" })
    }

    res.status(500).send("Server error")
  }
})
