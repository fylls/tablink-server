// this DB collection will handle data of the orders that client can place once inside a restaurant
// data is accessible in the TablinkAdminPage where every restaurant could see all the orders placed by their clients

const { Schema, model } = require("mongoose")

const ObjectID = Schema.Types.ObjectId

const OrderSchema = new Schema(
  {
    user: {
      type: ObjectID,
      ref: "users",
    },

    restaurantId: {
      type: ObjectID,
      ref: "restaurants",
    },

    customerName: {
      type: String,
      required: true,
    },

    tableNumber: { type: Number },

    totalPrice: {
      type: String,
      required: true,
    },

    served: {
      type: Boolean,
      default: false,
    },

    items: [
      {
        dishId: {
          type: ObjectID,
          ref: "restaurants.menu",
        },

        name: {
          type: String,
          required: true,
        },

        price: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },
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
    "restaurant": ObjectId(12345678910111213141516)

    "customerName": "marco",

    "tableNumber": 4



    "items": [

      {
        "dishId": ObjectId(12345678910111213141516),
        "name": "Linguine al Tartufo",
        "price": "11.50",
        "quantity": 2
      },

      {
        "dishId": ObjectId(12345678910111213141516),
        "name": "Patatine Fritte",
        "price": "3.50",
        "quantity": 1
      }

    ]

    "totalPrice": "15.00"

    "date": "2016-05-18T16:00:00Z"

  }

*/

module.exports = Order = model("orders", OrderSchema)
