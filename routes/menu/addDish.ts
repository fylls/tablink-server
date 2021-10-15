// dependencies
import express from "express"
const router = express.Router()

// input validator
import { check, validationResult } from "express-validator"

// middleware
import auth from "../../utils/auth"

// database
import Restaurant from "../../models/Restaurant"

// exporting
export default router

/*=====================      M  E  N  U      =====================*/

/**
 *
 * @route   POST api/restaurants/:restID/menu
 * @desc    add dish to restaurant
 * @access  private
 *
 */

const menuOptions = [
    check("name", "name is required").not().isEmpty(),
    check("price", "price is required").not().isEmpty(),
    check("category", "category is required").not().isEmpty(),
]

router.post("/:restID/menu", [auth, menuOptions], async (req: any, res: any) => {

    // check for error in body
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json(errors.array())

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

    // build menu object
    const newMenuItem = { name, price, category }
    if (tags) newMenuItem.tags = tags
    if (image) newMenuItem.image = image
    if (available) newMenuItem.available = available
    if (percentage) newMenuItem.percentage = percentage
    if (ingredients) newMenuItem.ingredients = ingredients
    if (description) newMenuItem.description = description
    if (recommendation) newMenuItem.recommendation = recommendation

    try {
        // check if restaurant exists
        const restaurant = await Restaurant.findById(req.params.restID)
        if (!restaurant) return res.status(404).json("restaurant not found")

        // check if the user owning the restaurant is the one that updates it
        if (restaurant.user.toString() !== req.user) return res.status(401).json("user not authorized")

        // add menu item
        restaurant.menu.unshift(newMenuItem)
        await restaurant.save()

        // response
        res.json(restaurant)
        console.log("Dish Added")
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
}
)