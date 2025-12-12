const express = require('express');

const router = express.Router();

const tourController = require('./../controller/tourContoller') ; // exported from tourContoller.js)

router.route('/')
.get(tourController.getAllTours)
.post(tourController.createTour);

router.route('/:id')
.get(tourController.getOneTour)
.delete(tourController.deleteTour);

module.exports = router;