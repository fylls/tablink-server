/*

 USER = ADMIN 

 User DB collection handles sensible data of all restaurant-admin associated with Tablink
 admins are the only one who can modify their restaurants' data.

*/

// dependencies
const { Schema, model } = require("mongoose")
const ObjectID = Schema.Types.ObjectId

const UserSchema = new Schema(
  {
    // NECESSARY FOR SIGNUP
    // name email phone password

    email: {
      type: String,
      require: true,
      unique: true, // identified by email
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

    // array containing all restaurant associated with user
    // not required at beginning, will be update ad every restaurant created by user

    restaurants: [
      {
        type: ObjectID,
        ref: "restaurants",
      },
    ],

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
