// dependencies
import express from "express"
const router = express.Router()

// input validator
import { check, validationResult } from "express-validator"

// middleware
import auth from "../../utils/auth"

// database
import User from "../../models/User"
import Restaurant from "../../models/Restaurant"

// exporting
export default router

/*=============================    R E S T A U R A N T    =============================*/

/**
 *
 * @route   POST api/restaurants
 * @desc    create restaurants for a user
 * @access  private
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

router.post("/", [auth, restaurantOptions], async (req, res) => {
    // check for errors in body
    const errors = validationResult(req)

    if (!errors.isEmpty()) return res.status(400).json(errors.array())

    // object destructuring from BODY
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

    // build restaurant object
    const restaurantFields = {}
    restaurantFields.user = req.user
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

    try {
        // check if user exists
        const user = await User.findById(req.user).select("-password")
        if (!user) return res.status(404).json("wrong token")

        // create restaurant
        const newRest = new Restaurant(restaurantFields)
        await newRest.save()

        // add restaurant under user
        user.restaurants.unshift(newRest._id)
        await user.save()

        // response
        res.json(newRest)
        console.log("new restaurant")
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
}
)
