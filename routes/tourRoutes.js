const express = require('express')
const router = express.Router()

const { getAllTours, addTour, getOneTour, updateTour, deleteTour } = require('../controllers/toursController')
const checkBody = require('./../middlewares/tours/checkBody')


router.route('/')
 .get(getAllTours)
 .post(checkBody, addTour)

router.route('/:id')
 .get(getOneTour)
 .patch(updateTour)
 .delete(deleteTour)

module.exports = router