const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const Booking = require("../models/bookingModel");
const factory = require("./handlerFactory");
const User = require("../models/userModel");

const getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1 - get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // 2 - create the checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    // success_url: `${req.protocol}://${req.get("host")}/?my-tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get("host")}/my-tours?alert=booking`,
    cancel_url: `${req.protocol}://${req.get("host")}/tours/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
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
            images: [
              `${req.protocol}://${req.get("host")}/img/tours/${tour.imageCover}`,
            ],
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

// const createBookingCheckout = catchAsync(async (req, res, next) => {
//   // temporary solution
//   const { tour, user, price } = req.query;

//   if (!tour || !user || !price) return next();

//   await Booking.create({
//     tour,
//     user,
//     price,
//   });

//   res.redirect(req.originalUrl.split("?")[0]);
// });

const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.amount_total / 100;
  await Booking.create({
    tour,
    user,
    price,
  });
};

const webhookCheckout = (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event = req.body;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res.sendStatus(400);
  }

  // create the booking if everything is okey
  if (event.type === "checkout.session.completed")
    createBookingCheckout(event.data.object);

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

const createBooking = factory.createOne(Booking);
const getAllBookings = factory.getAll(Booking);
const getSingleBooking = factory.getOne(Booking);
const updateBooking = factory.updateOne(Booking);
const deleteBooking = factory.deleteOne(Booking);

module.exports = {
  getCheckoutSession,
  createBooking,
  getAllBookings,
  getSingleBooking,
  deleteBooking,
  updateBooking,
  webhookCheckout,
};
