const express = require('express')
const router = express.Router()

const { getAllUsers, createUser, getOneUser, updateUser, deleteUser } = require('../controllers/usersController')

// router.param('id', (req, res, next, val) =>
// {
//  console.log(val);
//  next()
// })

router.route('/')
 .get(getAllUsers)
 .post(createUser)

router.route('/:id')
 .get(getOneUser)
 .patch(updateUser)
 .delete(deleteUser)

module.exports = router