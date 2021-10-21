/*

 This DB collection handles all data of the restaurants associated with Tablink
 Only admins will have the right to modify their restaurant's data

*/

// TODO da dove viene l id dei piatti? lo aggiunge mogo a caso? qua non e specificato

// dependencies
import { Schema, model } from 'mongoose'
const ObjectID = Schema.Types.ObjectId

// defaults
const whiteIMG = 'https://www.designersguild.com/image/1024/59518'
const restIMG = 'https://www.villageowl.com/images/restauranticon.png'

const RestaurantSchema = new Schema(
    {
        //   REQUIRED FOR SIGNUP
        //   restName   type   street   civ   cap   city   province   country

        admin: {
            type: ObjectID,
            ref: 'admins',
        },

        restName: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            require: true,
        },

        // useful for restaurant with no photo
        layout: {
            type: String,
            enum: ['grid', 'list'],
            default: 'grid',
        },

        address: {
            street: {
                type: String,
                require: true,
            },

            civ: {
                type: String,
                require: true,
            },

            cap: {
                type: String,
                require: true,
            },

            city: {
                type: String,
                require: true,
            },

            province: {
                type: String,
                require: true,
            },

            country: {
                type: String,
                require: true,
            },
        },

        //   NOT REQUIRED => WILL BE ADDED ( at will ) BY ADMIN
        //   logo   restDescription   highlights   website   twitter   facebook   instagram   menu

        logo: {
            type: String,
            default: restIMG,
        },

        restDescription: {
            type: String,
        },

        highlights: [
            {
                type: String,
                default: whiteIMG,
            },
        ],

        social: {
            website: {
                type: String,
            },

            twitter: {
                type: String,
            },

            facebook: {
                type: String,
            },

            instagram: {
                type: String,
            },
        },

        // menu by default is an empty array []

        // name price category
        // image description tags ingredients image recommendation percentage available

        menu: [
            {
                name: {
                    type: String,
                    required: true,
                },

                image: {
                    type: String,
                    default: whiteIMG,
                },

                price: {
                    type: String,
                    required: true,
                },

                description: {
                    type: String,
                },

                category: {
                    type: String,
                    required: true,
                },

                tags: {
                    type: [String],
                    default: [],
                },

                ingredients: {
                    type: [String],
                    default: [],
                },

                recommendation: {
                    type: [String],
                    default: [],
                },

                percentage: {
                    type: String,
                    default: '100%',
                },

                views: {
                    type: Number,
                    default: 0,
                },

                available: {
                    type: Boolean,
                    default: true,
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

  PUT

  {

    'restName' : 'Ristortante Da Luigi',
    
    'type': 'ristorante',

    'street': 'via monte',
    'civ': '4',
    'cap': '61033',
    'city': 'Fano',
    'province': 'PU',
    'country': 'Italy',

    'restDescription': 'un bar molto buono',

    'highlights': [
      'https://www.designersguild.com/image/1024/59518',
      'https://www.designersguild.com/image/1024/59518',
      'https://www.designersguild.com/image/1024/59518'
    ],

    'website': 'www.com',
    'twitter': 'https://twitter.com',
    'facebook': 'https://facebook.com',
    'instagram': 'https://instagram.com',

    'menu' : [{
      'name': 'albicocca fatta in casa',
      'price': '19.99',
      'description': 'fruttta fresca',
      'category': 'fruits',
      'tags': ['vegan'],
      'ingredients': ['fruits'],
      'image': 'https://www.designersguild.com/image/1024/59518'
    }]
  
  }


  POST

  {

    'restName' : 'Ristortante Da Luigi',

    'type': 'ristorante',

    'street': 'via monte',
    'civ': '4',
    'cap': '61033',
    'city': 'Fano',
    'province': 'PU',
    'country': 'Italy',

  }

*/

export default model('restaurants', RestaurantSchema)
