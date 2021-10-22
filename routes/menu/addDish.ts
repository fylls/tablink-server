// dependencies
import { Response, Router } from "express"

// input validator
import { body, validationResult } from "express-validator"

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
 * @route   POST api/restaurants/:restID/menu
 * @desc    add dish to restaurant
 * @access  private
 *
 */

router.post(
  "/:restID/menu",

  auth,
  body("name").exists(),
  body("price").exists(),
  body("category").exists(),

  async (req: any, res: Response) => {
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
    const newMenuItem: any = { name, price, category }
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

      // check if the admin owning the restaurant is the one that updates it
      if (restaurant.admin.toString() !== req.admin)
        return res.status(401).json("not authorized")

      // add menu item
      restaurant.menu.unshift(newMenuItem)
      await restaurant.save()

      // response
      res.json(restaurant)
      console.log("Dish Added")
    } catch (err: any) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)
