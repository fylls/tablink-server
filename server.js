const app = require("./app")
const { connectDB, DB_NAME } = require("./config/db.js")
const { success, error } = require("consola")

const PORT = process.env.PORT || 69

// Initialize Database and Server
const startServer = async () => {
  try {
    await connectDB()
    success({
      message: `Successfully connected with DATABASE: ${DB_NAME}`,
      badge: true,
    })

    app.listen(PORT)
    success({
      message: `Server started on PORT: ${PORT}`,
      badge: true,
    })
  } catch (err) {
    error({
      message: `Unable to connect with Database \n${err}`,
      badge: true,
    })

    // if Failing, Retry
    startApp()
  }
}

startServer()
