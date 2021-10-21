// dependencies
import express, { Application, Request, Response } from "express"
import cors from "cors"

//TODO implement cache and rate limiting

// initialize application
const app: Application = express()

// initialize middlewares
app.use(cors()) //                                                 accepting requests outside localhost
app.use(express.json()) //                                         parsing 'application/json'

// MENU routes
import addDishRoute from "./routes/menu/addDish"
import deleteDishRoute from "./routes/menu/deleteDish"
import getDishRoute from "./routes/menu/getDish"
import updateDishRoute from "./routes/menu/updateDish"

// RESTAURANT routes
import addRestRoute from "./routes/restaurant/addRestaurant"
import deleteRestRoute from "./routes/restaurant/deleteRestaurant"
import getAllRestsRoute from "./routes/restaurant/getAll"
import getMyRestsRoute from "./routes/restaurant/getMine"
import getOneRestRoute from "./routes/restaurant/getOne"
import updateRestRoute from "./routes/restaurant/updateRestaurant"

// USER routes
import meRoute from "./routes/user/me"
import signInRoute from "./routes/user/signIn"
import signUpRoute from "./routes/user/signUp"

// API
app.use("/api/restaurants", addDishRoute)
app.use("/api/restaurants", deleteDishRoute)
app.use("/api/restaurants", getDishRoute)
app.use("/api/restaurants", updateDishRoute)

app.use("/api/restaurants", addRestRoute)
app.use("/api/restaurants", deleteRestRoute)
app.use("/api/restaurants", getAllRestsRoute)
app.use("/api/restaurants", getMyRestsRoute)
app.use("/api/restaurants", getOneRestRoute)
app.use("/api/restaurants", updateRestRoute)

app.use("/api/user", meRoute)
app.use("/api/user", signInRoute)
app.use("/api/user", signUpRoute)

// home API route
app.get("/api", (req: Request, res: Response) =>
  res.sendFile(__dirname + "/public/index.html")
)

// exporting just 'app' for enabling testing
export default app
