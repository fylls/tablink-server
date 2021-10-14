// Dependencies
const express = require("express")
const router = express.Router()

// Input Validator
const { check, validationResult } = require("express-validator")

// Middleware
const auth = require("../../utils/auth")

// Database
const User = require("../../models/User")

// Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

// Check .env File
if (
  !process.env.STRIPE_SECRET_KEY ||
  !process.env.STRIPE_PUBLISHABLE_KEY ||
  !process.env.SUBSCRIPTION_KEY
) {
  console.log("The .env file is not configured")

  process.env.STRIPE_SECRET_KEY
    ? ""
    : console.log("Add STRIPE_SECRET_KEY to .env file.")

  process.env.STRIPE_PUBLISHABLE_KEY
    ? ""
    : console.log("Add STRIPE_PUBLISHABLE_KEY to .env file.")

  process.env.SUBSCRIPTION_KEY
    ? ""
    : console.log("Add SUBSCRIPTION_KEY to your .env file.")

  process.exit()
}

// Exporting
module.exports = router

/*=======================  S   T   R   I   P   E   =======================*/

/**
 *
 * @route   POST api/stripe/create-subscription
 * @access  Private
 * @desc    Create Subscription from email
 *
 */

router.post("/create-subcription", auth, async (req, res) => {
  // identify user by token
  const user = await User.findOne({ _id: req.user.id })

  if (!user) {
    return res.status(400).json({ errors: [{ msg: "User does not exists" }] })
  }

  const { payment_method } = req.body
  const userEmail = user.email

  const customer = await stripe.customers.create({
    email: userEmail,
    payment_method: payment_method,
    invoice_settings: { default_payment_method: payment_method },
  })

  // TablinkMenus 9.99 eur/month
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan: process.env.SUBSCRIPTION_KEY }],
    expand: ["latest_invoice.payment_intent"],
    trial_end: moment().add(1, "month").unix(),
  })

  const status = subscription.latest_invoice.payment_intent.status
  const client_secret = subscription.latest_invoice.payment_intent.client_secret

  console.log("got the money")
  res.json({ client_secret: client_secret, status: status })
})

//TODO automate cancel sub
// router.post("/cancel-subscription",auth, async (req, res) => {
//   // Delete the subscription
//   const deletedSubscription = await stripe.subscriptions.del(
//     req.body.subscriptionId
//   )
//   res.send(deletedSubscription)
// })
