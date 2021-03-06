// dependencies
const express = require("express")
const router = express.Router()

// middleware
const auth = require("../../utils/auth")

// database
const Restaurant = require("../../models/Restaurant")

// exporting
module.exports = router

/*=============================    R E S T A U R A N T    =============================*/

/**
 *
 * @route   PUT api/restaurants/:restID
 * @desc    update restaurants for a user
 * @access  private
 *
 * @header  REQUIRED:       x-auth-token
 * @body    NON REQUIRED:   restName   type   street   civ   cap   city   province   country   logo   restDescription   highlights   website   twitter   facebook   instagram   menu (only for DB admin)
 *
 */

router.put("/:restID", auth, async (req, res) => {
    // Check if Restaurant Exists
    let restaurant = await Restaurant.findById(req.params.restID)
    if (!restaurant) return res.status(404).json("rest not found")

    // check if is the user owning the restaurant is the one modifying it
    if (restaurant.user.toString() !== req.user.id) return res.status(401).json("user not authorized")

    // object Destructuring from BODY
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

      menu, // (only for DB developers)
    } = req.body

    // build restaurant object
    const restaurantFields = {}
    if (restName) restaurantFields.restName = restName
    if (type) restaurantFields.type = type
    if (logo) restaurantFields.logo = logo
    if (highlights) restaurantFields.highlights = highlights
    if (restDescription) restaurantFields.restDescription = restDescription

    // layout
    if (layout && layout === ("grid" || "list")) restaurantFields.layout = layout

    // build address object
    restaurantFields.address = {}
    if (street) restaurantFields.address.street = street
    if (civ) restaurantFields.address.civ = civ
    if (cap) restaurantFields.address.cap = cap
    if (city) restaurantFields.address.city = city
    if (province) restaurantFields.address.province = province
    if (country) restaurantFields.address.country = country

    // build social object
    restaurantFields.social = {}
    if (website) restaurantFields.social.website = website
    if (facebook) restaurantFields.social.facebook = facebook
    if (twitter) restaurantFields.social.twitter = twitter
    if (instagram) restaurantFields.social.instagram = instagram

    // Menu Array (useful for DB developers)
    if (menu) restaurantFields.menu = menu

    try {
      // if there is a restaurant => update
      const updatedRest = await Restaurant.findByIdAndUpdate(
        req.params.restID,
        { $set: restaurantFields },
        { new: true }
      )

      res.json(updatedRest)
      console.log("restaurant updated ")
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)
