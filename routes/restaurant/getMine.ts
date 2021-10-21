//TODO
// define rest schema
// function
// err type

// dependencies
import { Response, Router } from 'express';
import ExtendedRequest from '../../Interfaces/ExtendedRequest';

// middleware
import auth from '../../utils/auth'

// database
import Admin from '../../models/Admin'
import Restaurant from '../../models/Restaurant'

// exporting
const router = Router()
export default router

/*=============================    R E S T A U R A N T    =============================*/

/**
 *
 * @route   GET api/restaurants/me
 * @desc    get current admin's restaurant
 * @access  private
 *
 * @header  x-auth-token
 *
 */

router.get('/me', auth, async (req: ExtendedRequest, res: Response) => {
    try {
        const admin = await Admin.findById(req.admin).select('-password')

        // get all the IDs of the restaurants associated with Admin
        // and Return to res an array with all the restaurants

        let restaurantsArray:any = []

        const restIDs = admin.restaurants

        async function getRestaurants() {
            for (const restID of restIDs) {
                const rest = await Restaurant.findById(restID)
                restaurantsArray.unshift(rest)
            }
        }

        await getRestaurants()

        if (!restaurantsArray) res.status(400).json('there is no restaurant for this admin')
        res.json(restaurantsArray)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})
