// dependencies
import { Request, Response, Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// input validator
import { body, validationResult } from "express-validator"

// JWT secret
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ?? ""
if (JWT_SECRET_KEY === "") console.log("no JWT secret")

// database
import Admin from "../../models/Admin"

// exporting
const router = Router()
export default router

/*=============================    U   S   E   R   =============================*/

/**
 *
 * @route   POST api/admin/signUp
 * @desc    Register admin
 * @access  public
 *
 * @body    name . email . phone . password
 *
 */

router.post(
  "/signUp",

  body("name").exists(),
  body("phone").exists(),
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),

  async (req: Request, res: Response) => {
    // check for errors in body
    const errors = validationResult(req.body)
    if (!errors.isEmpty()) return res.status(400).json(errors.array())

    // object destructuring from BODY
    const { name, email, phone, password } = req.body

    try {
      let admin = await Admin.findOne({ email })

      // check if admin already exists
      if (admin) return res.status(400).json("admin already exists")

      // encrypt password
      const hashed = await bcrypt.hash(password, 12)

      // create new admin
      const newAdmin = new Admin({
        name,
        phone,
        email: email.toLowerCase(),
        password: hashed,
      })

      // save admin to DB
      await newAdmin.save()

      // get the payload (._id without mongoose)
      const payload = { admin: newAdmin.id }

      // remove PSW
      delete newAdmin.password

      // return token
      jwt.sign(
        payload,

        JWT_SECRET_KEY,

        { expiresIn: 36000 },

        (err, token) => {
          if (err) throw err
          res.json({ token, admin: newAdmin })
        }
      )

      console.log("admin signed up")
    } catch (err: any) {
      console.error(err.message)
      res.status(500).send("Server error")
    }
  }
)
