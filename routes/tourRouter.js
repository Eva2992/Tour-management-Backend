const express = require('express');

const router = express.Router(); // 1st run express router

const tourController = require('../Controller/tourContoller') ; // exported from tourContoller.js)

//router.param('id' , tourController.checkID) ; // middleware (run before the route handler
//  and after route.express.Router())
//  , runs for any route with :id parameter

router.route('/') // route handler for /tours
.get(tourController.getAllTours)
.post( tourController.createTour) ; 


 router.route('/:id')
.get(tourController.getOneTour)
.delete(tourController.deleteTour)
.patch(tourController.updateTour) ; 

module.exports = router;