import app from "./app"
import { connectDB, DB_NAME } from "./utils/db.js"
import consola from "consola"

const PORT = process.env.PORT ?? 3000

// initialize database and server
const startServer = async () => {
  try {
    await connectDB()

    consola.success({
      message: `successfully connected to DATABASE: ${DB_NAME}`,
      badge: true,
    })

    app.listen(PORT)

    consola.success({
      message: `Server started on PORT: ${PORT}`,
      badge: true,
    })
  } catch (err) {
    consola.error({
      message: `Unable to connect with Database \n${err}`,
      badge: true,
    })
  }
}

startServer()
