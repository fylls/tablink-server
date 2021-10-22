// dependencies
import { Request, Response, Router } from "express"

// database
import Restaurant from "../../models/Restaurant"

// exporting
const router = Router()
export default router

/*=====================      M  E  N  U      =====================*/

/**
 *
 * @route   GET api/restaurants/:restID/menu/:dishID (of item)
 * @desc    get dish by menuID
 * @access  public
 *
 */

router.get("/:restID/menu/:dishID", async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restID)

    if (!restaurant) return res.status(400).json("restaurant not found")

    // get index of dish-item
    const index = restaurant.menu
      .map((item: any) => item.id)
      .indexOf(req.params.dishID)

    if (restaurant.menu[index]) return res.json(restaurant.menu[index])
    else return res.status(400).json("dish not found")

    console.log("Dish Retrieved")
  } catch (err: any) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})
