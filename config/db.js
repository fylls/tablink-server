// Mongoose for handling MongoDB
const mongoose = require("mongoose")

// Config
require("dotenv").config()

// Environment
const NODE_ENV = process.env.NODE_ENV
const MONGO_URI = process.env.MONGO_URI
const MONGO_URI_TEST = process.env.MONGO_URI_TEST

// Connection Variables
const URI = NODE_ENV === "test" ? MONGO_URI_TEST : MONGO_URI
const DB_NAME = URI.substring(URI.lastIndexOf("/") + 1, URI.lastIndexOf("?"))

// Opening the Connection
const connectDB = async DB => {
  await mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
}

// Closing the Connection
const shoutDownDB = async () => {
  mongoose.connection.close(() =>
    console.log(`closing connection with DATABASE: ${DB_NAME} `)
  )
}

// Exporting
module.exports = { connectDB, shoutDownDB, DB_NAME }
