// dependencies
import mongoose from 'mongoose'

// environment
require('dotenv').config()
const NODE_ENV = process.env.NODE_ENV ?? ''
const MONGO_URI = process.env.MONGO_URI ?? ''
const MONGO_URI_TEST = process.env.MONGO_URI_TEST ?? ''

// check if URIs are undefined
if (MONGO_URI.length === 0 || MONGO_URI_TEST.length === 0) console.log('URIs not defined')

// connection variables
const URI = (NODE_ENV === 'test' ? MONGO_URI_TEST : MONGO_URI)
const DB_NAME = URI.substring(URI.lastIndexOf('/') + 1, URI.lastIndexOf('?'))

// opening the connection
const connectDB = async () => await mongoose.connect(URI)

// closing the connection
const shoutDownDB = async () => {
    mongoose.connection.close(() => console.log(`closing connection with DATABASE: ${DB_NAME} `))
}

// exporting
export { connectDB, shoutDownDB, DB_NAME }
