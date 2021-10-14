// Dependencies
const express = require("express")
const router = express.Router()

// Database
const Restaurant = require("../../models/Restaurant")

// Exporting
module.exports = router

/*=====================     V   I   E   W   S     =====================*/

/**
 *
 * @route   PUT api/views/:restID/:menuID
 * @desc    Update dish views
 * @access  Private
 *
 */

router.put(
  "/:restID/:dishID",

  async (req, res) => {
    try {
      // Check if Restaurant Exists
      const restaurant = await Restaurant.findById(req.params.restID)
      if (!restaurant) {
        return res.status(400).json({ msg: "restaurant not found" })
      }

      // get index of menu-item
      const index = restaurant.menu
        .map(item => item.id)
        .indexOf(req.params.dishID)

      if (restaurant.menu[index]) {
        try {
          restaurant.menu[index].views += 1
          await restaurant.save()
          res.json(restaurant.menu[index])
          console.log("piato aggiornato")
        } catch (err) {
          console.error(err.message)
          res.status(500).send("Server Error")
        }
      } else {
        return res.status(400).json({ msg: "menu-item not found" })
      }
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)
