// Dependencies
const express = require("express")
const router = express.Router()

// Middleware
const auth = require("../../middleware/auth")

// Database
const Restaurant = require("../../models/Restaurant")

// Exporting
module.exports = router

/*=============================    R E S T A U R A N T    =============================*/

/**
 *
 * @route   PUT api/restaurants/:restID
 * @desc    Update Restaurants for a user
 * @access  Private
 *
 * @header  REQUIRED:       x-auth-token
 * @body    NON REQUIRED:   restName   type   street   civ   cap   city   province   country   logo   restDescription   highlights   website   twitter   facebook   instagram   menu (only for DB admin)
 *
 */

router.put(
  "/:restID",

  auth,

  async (req, res) => {
    // Check if Restaurant Exists
    let restaurant = await Restaurant.findById(req.params.restID)
    if (!restaurant) return res.status(404).json({ msg: "rest not found" })

    // check if is the user owning the restaurant is the one modifying it
    // post.user (ObjectId) , req.user.id (String)
    if (restaurant.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "user not authorized" })
    }

    // Object Destructuring from BODY
    const {
      restName,
      type,
      logo,
      highlights,
      restDescription,
      layout,

      street,
      civ,
      cap,
      city,
      province,
      country,

      website,
      twitter,
      facebook,
      instagram,

      menu, // (only for DB admin)
    } = req.body

    // Build restaurant object
    const restaurantFields = {}
    if (restName) restaurantFields.restName = restName
    if (type) restaurantFields.type = type
    if (logo) restaurantFields.logo = logo
    if (highlights) restaurantFields.highlights = highlights
    if (restDescription) restaurantFields.restDescription = restDescription

    // layout
    if (layout) {
      if (layout === ("grid" || "list")) {
        restaurantFields.layout = layout
      }
    }

    // Build address object
    restaurantFields.address = {}
    if (street) restaurantFields.address.street = street
    if (civ) restaurantFields.address.civ = civ
    if (cap) restaurantFields.address.cap = cap
    if (city) restaurantFields.address.city = city
    if (province) restaurantFields.address.province = province
    if (country) restaurantFields.address.country = country

    // Build social object
    restaurantFields.social = {}
    if (website) restaurantFields.social.website = website
    if (facebook) restaurantFields.social.facebook = facebook
    if (twitter) restaurantFields.social.twitter = twitter
    if (instagram) restaurantFields.social.instagram = instagram

    // Menu Array (whole array directly, used only by Admins)
    if (menu) restaurantFields.menu = menu

    try {
      // if there is a restaurant => update
      const updatedRest = await Restaurant.findByIdAndUpdate(
        req.params.restID,
        { $set: restaurantFields },
        { new: true }
      )

      res.json(updatedRest)
      console.log("ristorante aggiornato")
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)
