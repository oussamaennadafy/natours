const express = require('express')
const router = express.Router()

const { getAllUsers, addUser, getOneUser, updateUser, deleteUser } = require('../controllers/usersController')

router.route('/')
 .get(getAllUsers)
 .post(addUser)

router.route('/:id')
 .get(getOneUser)
 .patch(updateUser)
 .delete(deleteUser)

module.exports = router