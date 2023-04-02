const express = require('express')
const router = express.Router()

const { getUser, getUsers, addUser, updateUser, deleteUser } = require('./../controller/users')

router.route('/api/v1/users')
 .get(getUsers)
 .post(addUser)

router.route('/api/v1/users/:id')
 .get(getUser)
 .patch(updateUser)
 .delete(deleteUser)

module.exports = router