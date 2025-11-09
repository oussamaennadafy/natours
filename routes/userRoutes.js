const express = require("express");
const { getAllUsers } = require("../controllers/userController");

const router = express.Router();

router.route("/").get(getAllUsers);

// router.route("/:id").get(getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = router;
