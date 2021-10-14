// User DB collection handles sensible infos of all restaurant-admin associated with dablink brand
// admins have the right to have one or more restaurants and to modify their data.

const { Schema, model } = require("mongoose")

const ObjectID = Schema.Types.ObjectId

const UserSchema = new Schema(
  {
    // NECESSARY FOR SIGNUP
    // name email phone password

    // identified by email
    email: {
      type: String,
      require: true,
      unique: true,
    },

    name: {
      type: String,
      require: true,
    },

    phone: {
      type: String,
      require: true,
    },

    password: {
      type: String,
      require: true,
    },

    // array containing all restaurant associeted with user
    // not required at beginning, will be update ad every restaurant created by user

    restaurants: [
      {
        type: ObjectID,
        ref: "restaurants",
      },
    ],

    // created by Stripe

    CustomerId: {
      type: String,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
)

/*

  E  X  A  M  P  L  E

  {
    "name": "Mario Caprio",
    "email": "dicaprio@gmail.com",
    "phone": "3290346555",
    "password": "123456"
  }

*/

module.exports = User = model("users", UserSchema)
