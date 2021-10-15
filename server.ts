import app from "./app"
import { connectDB, DB_NAME } from "./utils/db.js"
import { success, error } from "consola"

const PORT = process.env.PORT ?? 3000

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
    }
}

startServer()
