//TODO
// idk what else i should do

// dependencies
import { Response, NextFunction } from "express"
import ExtendedRequest from "../Interfaces/ExtendedRequest"
import jwt from "jsonwebtoken"

// environment
require("dotenv").config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ?? ""

// middleware
export default (req: ExtendedRequest, res: Response, next: NextFunction) => {
  // get token from header
  const token = req.header("x-auth-token")

  // check if token exists
  if (!token) return res.status(401).json("no token, authorization denied")

  // check if secret exists
  if (!JWT_SECRET_KEY) console.log("no JWT secret")

  // verify Token: decode it with secret and assign it to user0
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY)
    req.admin = decoded.user
    console.log(decoded)
    next()
  } catch (err) {
    return res.status(401).json("token is not valid")
  }
}
