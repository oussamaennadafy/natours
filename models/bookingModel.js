const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  tour: {
    type: "ObjectId",
    reference: "Tour",
    require: [true, "Booking must belong to a tour"],
  },
  user: {
    type: "ObjectId",
    reference: "User",
    require: [true, "Booking must belong to a user"],
  },
  price: {
    type: Number,
    require: [true, "booking must have a price!"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "tour",
    select: "name",
  });

  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
