// dependencies
import { Request, Response, Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// input validator
import { check, validationResult } from "express-validator"

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
 * @route   POST api/user/signUp
 * @desc    Register User
 * @access  public
 *
 * @body    name . email . phone . password
 *
 */

const signUpOptions = [
  check("name", "Name is required").not().isEmpty(),
  check("phone", "Phone is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("password", "password must be longer than 6 characters ").isLength({
    min: 6,
  }),
]

router.post("/signUp", signUpOptions, async (req: Request, res: Response) => {
  // check for errors in body
  const errors = validationResult(req.body)
  if (!errors.isEmpty()) return res.status(400).json(errors.array())

  // object destructuring from BODY
  const { name, email, phone, password } = req.body

  try {
    let admin = await Admin.findOne({ email })

    // check if admin already exists
    if (admin) return res.status(400).json("Admin already exists")

    // encrypt password
    const hashed = await bcrypt.hash(password, 12)

    // create new admin
    const newAdmin = new Admin({
      name,
      email,
      phone,
      password: hashed,
    })

    // save admin to DB
    await newAdmin.save()

    // get the payload (._id without mongoose)
    const payload = { user: newAdmin.id }

    // remove PSW
    delete newAdmin.password

    // return token
    jwt.sign(
      payload,

      JWT_SECRET_KEY,

      { expiresIn: 36000 },

      (err, token) => {
        if (err) throw err
        res.json({ token, user: newAdmin })
      }
    )

    console.log("user signed up")
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})
