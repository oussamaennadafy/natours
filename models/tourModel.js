const mongoose = require("mongoose");

const tourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "a tour must have a name"],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, "a tour must have a duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "a tour must have a group size"],
  },
  difficulty: {
    type: String,
    required: [true, "a tour must have a difficulty"],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "a tour must have a price"],
  },
  Pricediscount: {
    type: Number,
  },
  Summary: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    required: [true, "a tour must have a description"],
  },
  imageCover: {
    type: String,
    required: [true, "a tour must have a cover image"],
  },
  images: [String],
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Tour = mongoose.model("tours", tourseSchema);

module.exports = Tour;
