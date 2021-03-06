// dependencies
const express = require("express")
const router = express.Router()

// database
const Restaurant = require("../../models/Restaurant")

// exporting
module.exports = router

/*=============================    R E S T A U R A N T    =============================*/

/**
 *
 * @route   GET api/restaurants/search/:restID
 * @desc    get restaurant by restID
 * @access  public
 *
 * @params  :restID
 */

router.get("/search/:restID", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restID)

    if (!restaurant) return res.status(400).json("restaurant not found")
    res.json(restaurant)
    console.log("Restaurant Found")
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") return res.status(404).json("restaurant not found")
    res.status(500).send("Server error")
  }
})
