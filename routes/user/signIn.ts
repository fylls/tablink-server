// dependencies
import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// input validator
import { check, validationResult } from 'express-validator'

// JWT secret
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ?? ''
if (JWT_SECRET_KEY==='') console.log('no JWT secret')

// database
import Admin from '../../models/Admin'

// exporting
const router = Router()
export default router

/*=============================    U   S   E   R   =============================*/

/**
 *
 * @route   POST api/admin/signIn
 * @desc    authenticate admin & get token
 * @access  public
 *
 * @body    email . password
 *
 */

const signInOptions = [
    check('email', 'Please include a valid email').exists(),
    check('password', 'password is requiered').exists(),
]

router.post('/signIn', signInOptions, async (req: Request, res: Response) => {
    // check for errors in Body
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json(errors.array())

    // object destructuring from BODY
    const { email, password } = req.body

    try {
        let admin = await Admin.findOne({ email })

        // check if admin exists (admin is identified by email)
        if (!admin) return res.status(400).json('Invalid Credentials')

        // check if password is correct
        // password         =>      given by admin in req.body
        // admin.password    =>      hashed password stored in DB
        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) return res.status(400).json('Invalid Credentials')

        // get the payload (._id without mongoose)
        const payload = { admin: admin.id }

        // return token
        jwt.sign(
            payload,

            JWT_SECRET_KEY,

            { expiresIn: 3600000 },

            (err, token) => {
                if (err) throw err
                res.json({ token })
            }
        )

        console.log('user logged')
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})
