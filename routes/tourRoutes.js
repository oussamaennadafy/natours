const express = require('express')
const router = express.Router()

const { getAllTours, addTour, getOneTour, updateTour, deleteTour } = require('../controllers/toursController')


router.route('/')
 .get(getAllTours)
 .post(addTour)

router.route('/:id')
 .get(getOneTour)
 .patch(updateTour)
 .delete(deleteTour)

module.exports = router