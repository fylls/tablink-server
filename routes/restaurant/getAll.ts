// dependencies
import { Request, Response, Router } from "express"

// database
import Restaurant from "../../models/Restaurant"

// exporting
const router = Router()
export default router

/*=====================  R E S T A U R A N T  =====================*/

/**
 *
 * @route   GET api/restaurants
 * @desc    get all restaurants
 * @access  public
 *
 */

router.get("/", async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.find()
    res.json(restaurant)
    console.log("All Restaurant")
  } catch (err: any) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})
