// This DB collection will handle data of RESET PASSWORD REQUESTS

const { Schema, model } = require("mongoose")

const ObjectID = Schema.Types.ObjectId

const ResetPSWSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },

    user: {
      type: ObjectID,
      ref: "users",
    },

    success: Boolean,

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
    
    email: giorgio@giorgio.com

    user: ObjectId("82173rehg98ewyh9812")

    success: true

    "date": "2016-05-18T16:00:00Z"

  }

*/

module.exports = resetPSW = model("resetPSW", ResetPSWSchema)
