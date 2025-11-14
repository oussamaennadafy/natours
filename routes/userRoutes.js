const express = require("express");
const { updateMe } = require("../controllers/userController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.route("/updateMe").patch(protect, updateMe);

module.exports = router;
