const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");

const getOverview = catchAsync(async (req, res, next) => {
  // 1 - get tours data from collection
  const tours = await Tour.find();
  // 2 - build template
  // 3 - render the template with the data on it
  res.status(200).render("overview", {
    title: "all tours",
    tours,
  });
});

const getTour = catchAsync(async (req, res, next) => {
  // 1 - get the tour details
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });
  // 2 - build template
  // 3 - fill template with data
  res
    .status(200)
    .set(
      "Content-Security-Policy",
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
    )
    .render("tour", {
      title: `${tour.name} Tour`,
      tour,
    });
});

module.exports = {
  getOverview,
  getTour,
};
