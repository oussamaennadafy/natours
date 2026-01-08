const Review = require("../models/reviewModel");
const factory = require("./handlerFactory");

const setTourUSerId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tour;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const getReviewsOfTour = factory.getAll(Review);
const getSingleReview = factory.getOne(Review);
const createReview = factory.createOne(Review);
const deleteReview = factory.deleteOne(Review);
const updateReview = factory.updateOne(Review);

module.exports = {
  createReview,
  getReviewsOfTour,
  getSingleReview,
  deleteReview,
  updateReview,
  setTourUSerId,
};
