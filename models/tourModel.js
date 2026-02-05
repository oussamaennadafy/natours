const mongoose = require("mongoose");
const slugify = require("slugify");
// const User = require("./userModel");

const toursSchema = new mongoose.Schema(
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
        values: ["easy", "medium", "hard", "difficult"],
        message: "difficulty is either easy, medium, or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "the rating must be above 1"],
      max: [5, "the rating must be below 5"],
      set: (val) => Math.round(val * 10) / 10,
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
        message: "price discount ({VALUE}) should be less than the trip price",
      },
    },
    summary: {
      type: String,
      trim: true,
      unique: true,
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
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: "ObjectId",
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// toursSchema.index({ price: 1 });
toursSchema.index({ price: 1, ratingsAverage: -1 });

toursSchema.index({ slug: 1 });

toursSchema.index({ startLocation: "2dsphere" });

// VIRTUAL PROPERTY MIDDLEWARE - to define durationWeeks property
toursSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

toursSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
toursSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// toursSchema.pre("save", async function (next) {
//   const guidsPromises = this.guids.map(async (guidID) => User.findById(guidID));
//   const guidsDocs = await Promise.all(guidsPromises);
//   this.guids = guidsDocs;
//   next();
// });

// QUERY MIDDLEWARE
toursSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

toursSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});

toursSchema.post(/^find/, function (docs, next) {
  // console.log(`query took ${Date.now() - this.start}ms`);
  // console.log(docs);
  next();
});

// toursSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

const Tour = mongoose.model("Tour", toursSchema);

module.exports = Tour;
