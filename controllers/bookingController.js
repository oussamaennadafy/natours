const { Stripe } = require("stripe");
const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");

const getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1 - get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // 2 - create the checkout session
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} tour`,
            description: tour.summary,
            images: [`https://natours.dev/img/tours/${tour.imageCover}`],
          },
        },
      },
    ],
  });
  // 3 - create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});

module.exports = {
  getCheckoutSession,
};
