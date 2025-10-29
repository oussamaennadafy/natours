const mongoose = require("mongoose");
const slugify = require("slugify");

const tourseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "a tour must have a name"],
      unique: true,
      maxLength: [40, "a tour name must have less than or equal 40 chars"],
      minLength: [10, "a tour name must have more than or equal 10 chars"],
    },
    slug: {
      type: String,
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
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "difficulty is either easy, medium, or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "the rating must be above 1"],
      max: [5, "the rating must be below 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "a tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only point on current doc on NEW document creation
          return val < this.price;
        },
        message: "Pricediscount ({VALUE}) should be less than the trip price",
      },
    },
    Summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
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
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// VIRTUAL PROPERTY MIDDLEWARE - to define durationWeeks property
tourseSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourseSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE
tourseSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourseSchema.post(/^find/, function (docs, next) {
  console.log(`query took ${Date.now() - this.start}ms`);
  console.log(docs);
  next();
});

tourseSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("tours", tourseSchema);

module.exports = Tour;
