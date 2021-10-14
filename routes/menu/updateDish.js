// Dependencies
const express = require("express")
const router = express.Router()

// Input Validator
const { check, validationResult } = require("express-validator")

// Middleware
const auth = require("../../middleware/auth")

// Database
const Restaurant = require("../../models/Restaurant")

// Exporting
module.exports = router

/*=====================      M  E  N  U      =====================*/

/**
 *
 * @route   PUT api/restaurants/:restID/menu/:menuID
 * @desc    Update dish by ID
 * @access  Private
 *
 */

const menuItemOptions = [
  check("name", "name is required").not().isEmpty(),
  check("price", "price is required").not().isEmpty(),
  check("description", "description is required").not().isEmpty(),
  check("category", "category is required").not().isEmpty(),
]

router.put(
  "/:restID/menu/:dishID",

  // Middlewares
  [auth, menuItemOptions],

  async (req, res) => {
    // check for error in body
    const errors = validationResult(req.body)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // object destructuring from BODY
    const {
      name,
      price,
      description,
      category,
      tags,
      ingredients,
      image,
      available,
      recommendation,
      percentage,
    } = req.body

    if (name) newMenuItem.name = name
    if (tags) newMenuItem.tags = tags
    if (price) newMenuItem.price = price
    if (image) newMenuItem.image = image
    if (category) newMenuItem.category = category
    if (available) newMenuItem.available = available
    if (percentage) newMenuItem.percentage = percentage
    if (ingredients) newMenuItem.ingredients = ingredients
    if (description) newMenuItem.description = description
    if (recommendation) newMenuItem.recommendation = recommendation

    if (JSON.stringify(req.body) === JSON.stringify({})) {
      return res.status(400).json({ msg: "empty JSON" })
    }

    try {
      // Check if Restaurant Exists
      const restaurant = await Restaurant.findById(req.params.restID)
      if (!restaurant) {
        return res.status(400).json({ msg: "restaurant not found" })
      }

      // Check if the User Owning the Restaurant is the one that Updates it
      // restaurant.user (ObjectId) , req.user.id (String)
      if (restaurant.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "user not authorized" })
      }

      // get index of menu-item
      const index = restaurant.menu
        .map(item => item.id)
        .indexOf(req.params.dishID)

      if (restaurant.menu[index]) {
        try {
          restaurant.menu[index] = newMenuItem

          await restaurant.save()
          res.json(restaurant)
          console.log("menu aggiornato")
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
