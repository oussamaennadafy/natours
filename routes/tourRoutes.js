const express = require("express");
const {
  createTour,
  deleteTour,
  getAllTours,
  getSingleTour,
  updateTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require("../controllers/tourController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

// router.param("id", (req, res, next, val) => {
//   console.log(`tour is is ${val}`);
//   next();
// });
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/").get(protect, getAllTours).post(createTour);
router
  .route("/:id")
  .get(getSingleTour)
  .patch(updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

module.exports = router;
