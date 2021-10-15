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
 * @route   PUT api/restaurants/:restID/menu/:menuID
 * @desc    ppdate dish by ID
 * @access  private
 *
 */

const menuItemOptions = [
    check("name", "name is required").not().isEmpty(),
    check("price", "price is required").not().isEmpty(),
    check("description", "description is required").not().isEmpty(),
    check("category", "category is required").not().isEmpty(),
]

router.put("/:restID/menu/:dishID", [auth, menuItemOptions], async (req, res) => {

    // check for error in body
    const errors = validationResult(req.body)
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

    // check if body is blank
    if (JSON.stringify(req.body) === JSON.stringify({})) {
        return res.status(400).json("empty JSON")
    }

    try {
        // check if restaurant exists
        const restaurant = await Restaurant.findById(req.params.restID)
        if (!restaurant) return res.status(400).json("restaurant not found")

        // check if the user owning the restaurant is the one that updates it
        if (restaurant.user.toString() !== req.user) return res.status(401).json("user not authorized")

        // get index of menu-item
        const index = restaurant.menu
            .map(item => item.id)
            .indexOf(req.params.dishID)

        if (restaurant.menu[index]) {
            try {
                restaurant.menu[index] = newMenuItem
                await restaurant.save()
                res.json(restaurant)
                console.log("dish updated")
            } catch (err) {
                console.error(err.message)
                res.status(500).send("Server Error")
            }
        } else {
            return res.status(400).json("dish not found")
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
}
)
