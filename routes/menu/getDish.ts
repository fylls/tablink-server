// dependencies
import express from "express"
const router = express.Router()

// database
import Restaurant from "../../models/Restaurant"

// exporting
export default router

/*=====================      M  E  N  U      =====================*/

/**
 *
 * @route   GET api/restaurants/:restID/menu/:dishID (of item)
 * @desc    get dish by menuID
 * @access  public
 *
 */

router.get("/:restID/menu/:dishID", async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.restID)

        if (!restaurant) return res.status(400).json("restaurant not found")

        // get index of dish-item
        const index = restaurant.menu
            .map(item => item.id)
            .indexOf(req.params.dishID)

        if (restaurant.menu[index]) return res.json(restaurant.menu[index])
        else return res.status(400).json("dish not found")

        console.log("Dish Retrieved")
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})
