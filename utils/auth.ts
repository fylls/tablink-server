// dontenv - accessing env variables
require("dotenv").config()

// JWT - authentication & authorization using tokens
import jwt from "jsonwebtoken"
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ?? ''

// interface
// declare module "jsonwebtoken" {
//     export interface JwtPayload {
//         user: string;
//     }
// }

export default (req: any, res: any, next: any) => {
    // get token from header
    const token = req.header("x-auth-token")

    // check if token exists
    if (!token) return res.status(401).json("no token, authorization denied")

    // check if secret exists
    if (!JWT_SECRET_KEY) console.log("no JWT secret")

    // verify Token: decode it with secret and assign it to user0
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY)
        req.user = decoded.user
        console.log(decoded)
        next()
    } catch (err) {
        return res.status(401).json("token is not valid")
    }
}
