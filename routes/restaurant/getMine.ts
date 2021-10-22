// dependencies
import { Response, Router } from "express"
import { ObjectId } from "mongoose"

// middleware
import auth from "../../utils/auth"

// database
import Admin from "../../models/Admin"
import Restaurant from "../../models/Restaurant"

// exporting
const router = Router()
export default router

/*=============================    R E S T A U R A N T    =============================*/

/**
 *
 * @route   GET api/restaurants/me
 * @desc    get current admin's restaurant
 * @access  private
 *
 * @header  x-auth-token
 *
 */

router.get("/me", auth, async (req: any, res: Response) => {
  let restaurantsArray: any = []

  // get all the IDs of the restaurants associated with Admin
  // and Return to res an array with all the restaurants

  async function getRestaurants(restIDs: Array<ObjectId>) {
    for (const restID of restIDs) {
      const rest = await Restaurant.findById(restID)
      restaurantsArray.unshift(rest)
    }
  }

  try {
    const admin = await Admin.findById(req.admin).select("-password")

    const restIDs = admin.restaurants
    await getRestaurants(restIDs)

    if (!restaurantsArray)
      res.status(400).json("there is no restaurant for this admin")
    res.json(restaurantsArray)
  } catch (err: any) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})
