// dependencies
import express from "express"
const router = express.Router()

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
 * @route   GET api/restaurants/me
 * @desc    get current users restaurant
 * @access  private
 *
 * @header  x-auth-token
 *
 */

router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user).select("-password")

        // get all the IDs of the restaurants associated with User
        // and Return to res an array with all the restaurants

        let restaurantsArray = []

        const restIDs = user.restaurants

        async function getRestaurants() {
            for (const restID of restIDs) {
                const rest = await Restaurant.findById(restID)
                restaurantsArray.unshift(rest)
            }
        }

        await getRestaurants()

        if (!restaurantsArray) res.status(400).json("there is no restaurant for this user")
        res.json(restaurantsArray)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})
