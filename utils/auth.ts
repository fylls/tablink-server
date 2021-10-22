// dependencies
import ExtendedRequest from "../Interfaces/ExtendedRequest"
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

// environment
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ?? ""
if (JWT_SECRET_KEY === "") console.log("no JWT secret")

// middleware
export default (req: any, res: Response, next: NextFunction) => {
  // get token from header
  const token = req.header("x-auth-token")

  // check if token exists
  if (!token) return res.status(401).json("no token, authorization denied")

  // verify Token: decode it with secret and assign it to admin
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET_KEY)
    req.admin = decoded.admin
    next()
  } catch (err: any) {
    return res.status(401).json("token is not valid")
  }
}
