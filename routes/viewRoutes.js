const express = require("express");
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  getMyTours,
  updateUserData,
  alert,
} = require("../controllers/viewsController");
const { isLogedIn, protect } = require("../controllers/authController");

const router = express.Router();

router.use(alert);

router.get("/", isLogedIn, getOverview);
router.get("/tour/:slug", isLogedIn, getTour);
router.get("/login", isLogedIn, getLoginForm);
router.get("/me", protect, getAccount);
router.get("/my-tours", protect, getMyTours);

router.patch("/submit-user-data", protect, updateUserData);

module.exports = router;
