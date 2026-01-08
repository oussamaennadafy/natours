const express = require("express");
const {
  createReview,
  getReviewsOfTour,
  getSingleReview,
  deleteReview,
  setTourUSerId,
  updateReview,
} = require("../controllers/reviewController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getReviewsOfTour)
  .post(protect, restrictTo("user"), setTourUSerId, createReview);

router.route("/:id").get(getSingleReview);

router
  .route("/:id")
  .get(getSingleReview)
  .patch(protect, restrictTo("user", "admin"), updateReview)
  .delete(protect, restrictTo("user", "admin"), deleteReview);

module.exports = router;
