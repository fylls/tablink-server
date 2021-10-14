// dependencies
const express = require("express")
const cors = require("cors")

// initialize application
const app = express()

// initialize middlewares
app.use(cors()) //                                                 accepting requests outside localhost
app.use(express.json()) //                                         parsing "application/json"

// MENU routes
const addDishRoute = require("./routes/menu/addDish")
const deleteDishRoute = require("./routes/menu/deleteDish")
const getDishRoute = require("./routes/menu/getDish")
const updateDishRoute = require("./routes/menu/updateDish")

// RESTAURANT routes
const addRestRoute = require("./routes/restaurant/addRestaurant")
const deleteRestRoute = require("./routes/restaurant/deleteRestaurant")
const getAllRestsRoute = require("./routes/restaurant/getAll")
const getMyRestsRoute = require("./routes/restaurant/getMine")
const getOneRestRoute = require("./routes/restaurant/getOne")
const updateRestRoute = require("./routes/restaurant/updateRestaurant")

// USER routes
const meRoute = require("./routes/user/me")
const signInRoute = require("./routes/user/signIn")
const signUpRoute = require("./routes/user/signUp")

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

// Home API Route
app.get("/api", (req, res) => res.sendFile(__dirname + "/public/index.html"))

// Exporting just "app" for enabling testing
module.exports = app
