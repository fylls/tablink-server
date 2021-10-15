// Mongoose for handling MongoDB
import mongoose from "mongoose"

// Config
require("dotenv").config()

// Environment
const NODE_ENV = process.env.NODE_ENV ?? ""
const MONGO_URI = process.env.MONGO_URI ?? ""
const MONGO_URI_TEST = process.env.MONGO_URI_TEST ?? ""

// check if URIs are undefined
if (MONGO_URI.length === 0 || MONGO_URI_TEST.length === 0) {
    console.log("URIs not defined")
}

// Connection Variables
const URI = (NODE_ENV === "test" ? MONGO_URI_TEST : MONGO_URI)
const DB_NAME = URI.substring(URI.lastIndexOf("/") + 1, URI.lastIndexOf("?"))

// Opening the Connection
const connectDB = async () => await mongoose.connect(URI)

// Closing the Connection
const shoutDownDB = async () => {
    mongoose.connection.close(() => console.log(`closing connection with DATABASE: ${DB_NAME} `))
}

// Exporting
export { connectDB, shoutDownDB, DB_NAME }
