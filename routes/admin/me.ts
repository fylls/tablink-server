// dependencies
import { Response, Router } from "express"
import ExtendedRequest from "../../Interfaces/ExtendedRequest"

// database
import Admin from "../../models/Admin"

// middleware
import auth from "../../utils/auth"

// exporting
const router = Router()
export default router

/*=============================    U   S   E   R   =============================*/

/**
 *
 * @route   GET api/admin/me
 * @desc    get admin info
 * @access  private
 *
 * @header  x-auth-token
 *
 */

router.get("/me", auth, async (req: ExtendedRequest, res: Response) => {
  try {
    const admin = await Admin.findById(req.admin).select("-password")
    if (admin) res.json(admin)
    else return res.status(418).json("invalid token")
    console.log("admin data")
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})
