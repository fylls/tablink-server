// dependencies
import { Response, Router } from "express"

// input validator
import { body, validationResult } from "express-validator"

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
 * @route   POST api/restaurants
 * @desc    create restaurants for a admin
 * @access  private
 *
 * @header  REQUIRED:   x-auth-token
 * @body    REQUIRED:   restName   type   street   civ   cap   city   province   country
 *
 */

router.post(
  "/",

  auth,
  body("restName").exists(),
  body("type").exists(),
  body("street").exists(),
  body("civ").exists(),
  body("cap").exists(),
  body("city").exists(),
  body("province").exists(),
  body("country").exists(),
  body("layout").exists(),

  async (req: any, res: Response) => {
    // check for errors in body
    const errors = validationResult(req)

    if (!errors.isEmpty()) return res.status(400).json(errors.array())

    // object destructuring from BODY
    const {
      restName,
      type,
      street,
      civ,
      cap,
      city,
      province,
      country,
      layout,
    } = req.body

    // build restaurant object
    const restaurantFields: any = {}
    restaurantFields.admin = req.admin
    restaurantFields.restName = restName
    restaurantFields.type = type

    // layout
    if (layout === ("grid" || "list")) restaurantFields.layout = layout
    else return res.status(400).json("wrong layout")

    // Build address object
    restaurantFields.address = {}
    restaurantFields.address.street = street
    restaurantFields.address.civ = civ
    restaurantFields.address.cap = cap
    restaurantFields.address.city = city
    restaurantFields.address.province = province
    restaurantFields.address.country = country

    try {
      // check if admin exists
      const admin = await Admin.findById(req.admin).select("-password")
      if (!admin) return res.status(404).json("wrong token")

      // create restaurant
      const newRest = new Restaurant(restaurantFields)
      await newRest.save()

      // add restaurant under admin
      admin.restaurants.unshift(newRest._id)
      await admin.save()

      // response
      res.json(newRest)
      console.log("new restaurant")
    } catch (err: any) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)
