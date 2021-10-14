// Dependencies
const express = require("express")
const router = express.Router()

// Input Validator
const { check, validationResult } = require("express-validator")

// Middleware
const auth = require("../../utils/auth")

// Database
const Restaurant = require("../../models/Restaurant")

// Exporting
module.exports = router

/*=====================      M  E  N  U      =====================*/

/**
 *
 * @route   POST api/restaurants/:restID/menu
 * @desc    Add dish to restaurant
 * @access  Private
 *
 */

const menuOptions = [
  check("name", "name is required").not().isEmpty(),
  check("price", "price is required").not().isEmpty(),
  check("category", "category is required").not().isEmpty(),
]

router.post(
  "/:restID/menu",

  // Middlewares
  [auth, menuOptions],

  async (req, res) => {
    // check for error in body
    const errors = validationResult(req)
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

    // Build menu object
    const newMenuItem = {
      name,
      price,
      category,
    }

    if (tags) newMenuItem.tags = tags
    if (image) newMenuItem.image = image
    if (available) newMenuItem.available = available
    if (percentage) newMenuItem.percentage = percentage
    if (ingredients) newMenuItem.ingredients = ingredients
    if (description) newMenuItem.description = description
    if (recommendation) newMenuItem.recommendation = recommendation

    try {
      // Check if Restaurant Exists
      const restaurant = await Restaurant.findById(req.params.restID)
      if (!restaurant) {
        return res.status(404).json({ msg: "restaurant not found" })
      }

      // Check if the User Owning the Restaurant is the one that Updates it
      // restaurant.user (ObjectId) , req.user.id (String)
      if (restaurant.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "user not authorized" })
      }

      // Add Menu Item
      restaurant.menu.unshift(newMenuItem)
      await restaurant.save()

      res.json(restaurant)
      console.log("menu aggiornato")
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)
