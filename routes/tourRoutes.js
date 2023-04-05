const express = require('express')
const router = express.Router()

const { getAllTours, createTour, getOneTour, updateTour, deleteTour } = require('../controllers/toursController')


router.route('/')
 .get(getAllTours)
 .post(createTour)

router.route('/:id')
 .get(getOneTour)
 .patch(updateTour)
 .delete(deleteTour)

module.exports = router