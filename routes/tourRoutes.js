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

const router = express.Router();

// router.param("id", (req, res, next, val) => {
//   console.log(`tour is is ${val}`);
//   next();
// });
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router.route("/tour-stats").get(getTourStats);

router.route("/monthly-plan/:year").get(getMonthlyPlan);

router.route("/").get(getAllTours).post(createTour);

router.route("/:id").get(getSingleTour).patch(updateTour).delete(deleteTour);

module.exports = router;
