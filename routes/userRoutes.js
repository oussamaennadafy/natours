const express = require("express");
const { getAllUsers } = require("../controllers/userController");
const { updatePassword, protect } = require("../controllers/authController");

const router = express.Router();

router.route("/").get(getAllUsers);

router.route("/updatePassword").patch(protect, updatePassword);

module.exports = router;
