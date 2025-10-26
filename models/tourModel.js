const mongoose = require("mongoose");

const tourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "a tour must have a name"],
    unique: [true, "the tour name should be unique"],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "a tour must have a price"],
  },
});

const Tour = mongoose.model("tours", tourseSchema);

module.exports = Tour;
