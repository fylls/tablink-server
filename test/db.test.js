// Mongo Database
const { connectDB, shoutDownDB } = require("../config/db")

// Importing Mongoose models
const User = require("../models/User")
const Order = require("../models/Order")
const Restaurant = require("../models/Restaurant")

// describe("test Databse", () => {
//   test("/test route should work", async () => {
//     const res = await request(app).get("/test")
//     expect(res.body).toEqual("test")
//     expect(res.statusCode).toBe(200)
//   })
// })

// TEST database (TablinkMenuTest)
beforeAll(async () => {
  await connectDB()
})

// test collection: "users"
beforeAll(async () => {
  const userTest = new User({
    name: "test",
    email: "test@test.test",
    phone: "test",
    restaurant: "test",
    password: "test",
  })

  await userTest.save()
})

beforeAll(async () => {
  await User.deleteOne({ name: "test" })
})

// test collection: "restaurants"
beforeAll(async () => {
  const restaurantTest = new Restaurant({
    restName: "test",
    type: "test",
    street: "test",
    civ: "test",
    cap: "test",
    city: "test",
    province: "test",
    country: "test",
    restDescription: "test",
    highlights: ["test", "test", "test"],
    website: "test",
    twitter: "test",
    facebook: "test",
    instagram: "test",
    menu: [
      {
        name: "test",
        price: "test",
        description: "test",
        category: "test",
        tags: ["test"],
        ingredients: ["test"],
        image: "test",
      },
      {
        name: "test",
        price: "test",
        description: "test",
        category: "test",
        tags: ["test"],
        ingredients: ["test"],
        image: "test",
      },
    ],
  })

  await restaurantTest.save()
})

beforeAll(async () => {
  await Restaurant.deleteOne({ restName: "test" })
})

beforeAll(async () => {
  await shoutDownDB()
})
