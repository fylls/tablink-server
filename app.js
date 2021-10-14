// Dependencies
const express = require("express");
const path = require("path");
const cors = require("cors");

// Initialize Application
const app = express();

// Initialize Middlewares
app.use(cors()); //                                                 Accepting Requests Outside Localhost
app.use(express.json()); //                                         Parsing "application/json"

// Routes
const meRoute = require("./routes/user/me");
const logInRoute = require("./routes/user/logIn");
const signUpRoute = require("./routes/user/signUp");
// const pswForgotRoute = require("./routes/user/pswForgot") //TODO
// const pswResetRoute = require("./routes/user/pswReset") //TODO

const getDishRoute = require("./routes/menu/getDish");
const addDishRoute = require("./routes/menu/addDish");
const deleteDishRoute = require("./routes/menu/deleteDish");
const updateDishRoute = require("./routes/menu/updateDish");

const getAllRestsRoute = require("./routes/restaurant/getAll");
const getOneRestRoute = require("./routes/restaurant/getOne");
const getMyRestsRoute = require("./routes/restaurant/getMine");
const addRestRoute = require("./routes/restaurant/addRestaurant");
const deleteRestRoute = require("./routes/restaurant/deleteRestaurant");
const updateRestRoute = require("./routes/restaurant/updateRestaurant");

const createOrderRoute = require("./routes/order/createOrder");
const getAllOrdersOfRestRoute = require("./routes/order/getAllOrdersOfRestaurant");
const getSingleOrderRoute = require("./routes/order/getSingleOrder");
const updateOrderRoute = require("./routes/order/updateOrder");

const updateViewsRoute = require("./routes/views/updateViews")

// User Routes
app.use("/api/user/me", meRoute);
app.use("/api/user/logIn", logInRoute);
app.use("/api/user/signUp", signUpRoute);
// app.use("/api/user/forgot", pswForgotRoute) //TODO
// app.use("/api/user/reset", pswResetRoute)  //TODO

// Menu Routes
app.use("/api/restaurants", getDishRoute);
app.use("/api/restaurants", addDishRoute);
app.use("/api/restaurants", deleteDishRoute);
app.use("/api/restaurants", updateDishRoute);

// Restaurant Routes
app.use("/api/restaurants", getAllRestsRoute);
app.use("/api/restaurants", getOneRestRoute);
app.use("/api/restaurants", getMyRestsRoute);
app.use("/api/restaurants", addRestRoute);
app.use("/api/restaurants", deleteRestRoute);
app.use("/api/restaurants", updateRestRoute);

// Order Routes
app.use("/api/orders", createOrderRoute);
app.use("/api/orders", getAllOrdersOfRestRoute);
app.use("/api/orders", getSingleOrderRoute);
app.use("/api/orders", updateOrderRoute);

// Views Routes
app.use("/api/views", updateViewsRoute)

// Stripe Route
// const stripeRoute = require("./routes//stripe")
// app.use("/api/stripe", stripeRoute)

// Home API Route
app.get("/api", (req, res) => res.sendFile(__dirname + "/public/index.html"));

// Host API Route
app.get("/api/host", (req, res) => res.json(req.get("host")));

// Serve Static Assets in Production (Heroku)
// If you are developing just run: " npm run dev "
if (process.env.NODE_ENV === "production") {
  app.use(express.static("CLIENT/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "CLIENT", "build", "index.html"));
  });
}

// Exporting just "app" for enabling testing
module.exports = app;
