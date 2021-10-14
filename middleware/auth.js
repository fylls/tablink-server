// JWT for creating and handling Tokens (Authentication & Authorization)
const jwt = require("jsonwebtoken")

require("dotenv").config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

module.exports = (req, res, next) => {
  // Get Token from Header
  const token = req.header("x-auth-token")

  // Check if no Token
  if (!token) {
    return res.status(401).json({ msg: "no token, authorization denied" })
  }

  // Verify Token
  // Decode Token with Secret and Assign to User
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY)
    req.user = decoded.user
    next()
  } catch (err) {
    return res.status(401).json({ msg: "token is not valid" })
  }
}
