const express = require('express')
const router = express.Router()

const { getTour, getTours, addTour, updateTour, deleteTour } = require('./../controller/tours')


router.route('/api/v1/tours')
 .get(getTours)
 .post(addTour)

router.route('/api/v1/tours/:id')
 .get(getTour)
 .patch(updateTour)
 .delete(deleteTour)

module.exports = router