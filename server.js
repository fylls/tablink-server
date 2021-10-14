const app = require("./app")
const { connectDB, DB_NAME } = require("./utils/db.js")
const { success, error } = require("consola")

const PORT = process.env.PORT || 3000

// initialize database and server
const startServer = async () => {
  try {
    await connectDB()

    success({
      message: `successfully connected to DATABASE: ${DB_NAME}`,
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

    // retry if it fails
    startApp()
  }
}

startServer()
