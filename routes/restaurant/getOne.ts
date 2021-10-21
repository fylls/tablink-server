//TODO
// err type

// dependencies
import { Request, Response, Router } from 'express';

// database
import Restaurant from '../../models/Restaurant'

// exporting
const router = Router()
export default router

/*=============================    R E S T A U R A N T    =============================*/

/**
 *
 * @route   GET api/restaurants/search/:restID
 * @desc    get restaurant by restID
 * @access  public
 *
 * @params  :restID
 */

router.get('/search/:restID', async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findById(req.params.restID)
        if (!restaurant) return res.status(400).json('restaurant not found')
        res.json(restaurant)
        console.log('Restaurant Found')
    } catch (err) {
        console.error(err.message)
        if (err.kind === 'ObjectId') return res.status(404).json('restaurant not found')
        res.status(500).send('Server error')
    }
})
