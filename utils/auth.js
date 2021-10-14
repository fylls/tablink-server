// dontenv - accessing env variables
require("dotenv").config()

// JWT - authentication & authorization using tokens
const jwt = require("jsonwebtoken")
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

module.exports = (req, res, next) => {
  // get token from header
  const token = req.header("x-auth-token")

  // check token is present
  if (!token) return res.status(401).json("no token, authorization denied")

  // verify Token: decode it with secret and assign it to user
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY)
    req.user = decoded.user
    next()
  } catch (err) {
    return res.status(401).json("token is not valid")
  }
}
