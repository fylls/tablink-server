// TODO
// - err type

// dependencies
import { Response, Router } from "express"

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
 * @route   DELETE api/restaurants/:restID
 * @desc    delete restaurants by ID and delete ID in admin
 * @access  private
 *
 * @header  x-auth-token
 * @params  :restID
 *
 */

router.delete("/:restID", auth, async (req: any, res: Response) => {
  try {
    // check if restaurant exists
    const restaurant = await Restaurant.findById(req.params.restID)
    if (!restaurant) return res.status(404).json("restaurant not found")

    // check if the admin owning the restaurant is the one deleting it
    if (restaurant.admin.toString() !== req.admin)
      return res.status(401).json("not authorized")

    // remove restId from admin.restaurants in DB
    const restAdmin = await Admin.findById(req.admin)
    const removeIndex = restAdmin.restaurants.indexOf(req.params.restID)
    restAdmin.restaurants.splice(removeIndex, 1)

    // remove restaurant
    await restaurant.remove()
    await restAdmin.save()
    res.json("restaurant removed")
    console.log("restaurant removed")
  } catch (err: any) {
    console.error(err.message)
    if (err.kind === "ObjectId")
      return res.status(500).json("restaurant not found")
    res.status(500).send("Server Error")
  }
})
