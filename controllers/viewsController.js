const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");

const getOverview = catchAsync(async (req, res, next) => {
  // 1 - get tours data from collection
  const tours = await Tour.find();
  // 2 - build template
  // 3 - render the templkate with the data on it
  res.status(200).render("overview", {
    title: "all tours",
    tours,
  });
});

const getTour = (req, res) => {
  res.status(200).render("tour", {
    title: "The Forest Hicker Tour",
  });
};

module.exports = {
  getOverview,
  getTour,
};
