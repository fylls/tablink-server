//TODO
// - item type
// - err type
// auth middleware

// dependencies
import { Response, Router } from "express"
import ExtendedRequest from "../../Interfaces/ExtendedRequest"

// middleware
import auth from "../../utils/auth"

// database
import Restaurant from "../../models/Restaurant"

// exporting
const router = Router()
export default router

/*=====================      M  E  N  U      =====================*/

/**
 *
 * @route   api/restaurants/:restID/menu/:dishID
 * @desc    delete dish from restaurant
 * @access  private
 *
 */

router.delete(
  "/:restID/menu/:dishID",
  auth,
  async (req: ExtendedRequest, res: Response) => {
    try {
      // Check if Restaurant Exists
      const restaurant = await Restaurant.findById(req.params.restID)
      if (!restaurant) return res.status(400).json("restaurant not found")

      // check if the admin owning the restaurant is the one that updates it
      if (restaurant.admin.toString() !== req.admin)
        return res.status(401).json("not authorized")

      // get remove index
      const removeIndex = restaurant.menu
        .map(item => item.id)
        .indexOf(req.params.dishID)

      // remove element
      restaurant.menu.splice(removeIndex, 1)

      // save to DB and send response
      await restaurant.save()
      res.json(restaurant)
      console.log("Dish Deleted")
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)
