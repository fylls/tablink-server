// Dependencies
const express = require("express")
const router = express.Router()

// Input Validator
const { check, validationResult } = require("express-validator")

// Middleware
const auth = require("../../middleware/auth")

// Database
const User = require("../../models/User")
const Restaurant = require("../../models/Restaurant")

// Exporting
module.exports = router

/*=============================    R E S T A U R A N T    =============================*/

/**
 *
 * @route   POST api/restaurants
 * @desc    Create restaurants for a user
 * @access  Private
 *
 * @header  REQUIRED:   x-auth-token
 * @body    REQUIRED:   restName   type   street   civ   cap   city   province   country
 *
 */

const restaurantOptions = [
  check("restName", "please specify restName").not().isEmpty(),
  check("type", "please specify type").not().isEmpty(),
  check("street", "please specify street").not().isEmpty(),
  check("civ", "please specify civ").not().isEmpty(),
  check("cap", "please specify cap").not().isEmpty(),
  check("city", "please specify city").not().isEmpty(),
  check("province", "please specify province").not().isEmpty(),
  check("country", "please specify country").not().isEmpty(),
  check("layout", "please specify layout").not().isEmpty(),
]

router.post(
  "/",

  [auth, restaurantOptions], // Middlewares

  async (req, res) => {
    // Check for Errors in Body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Object Destructuring from BODY
    const {
      restName,
      type,
      street,
      civ,
      cap,
      city,
      province,
      country,
      layout,
    } = req.body

    // *

    // Build restaurant object
    const restaurantFields = {}

    restaurantFields.user = req.user.id
    restaurantFields.restName = restName
    restaurantFields.type = type

    // layout
    if (layout === ("grid" || "list")) restaurantFields.layout = layout
    else return res.status(400).json("wrong layout")

    // Build address object
    restaurantFields.address = {}

    restaurantFields.address.street = street
    restaurantFields.address.civ = civ
    restaurantFields.address.cap = cap
    restaurantFields.address.city = city
    restaurantFields.address.province = province
    restaurantFields.address.country = country

    // insert data
    try {
      // Check if User Exists
      const user = await User.findById(req.user.id).select("-password")
      if (!user) return res.status(404).json({ msg: "wrong token" })

      const newRest = new Restaurant(restaurantFields)
      await newRest.save()

      user.restaurants.unshift(newRest._id)
      await user.save()

      res.json(newRest)
      console.log("creato nuovo ristorante per user")
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)
