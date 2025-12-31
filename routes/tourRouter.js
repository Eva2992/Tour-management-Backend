const express = require('express');

const router = express.Router(); // 1st run express router

const tourController = require('../Controller/tourContoller') ; // exported from tourContoller.js)
const auth = require('./../Controller/authController');

//router.param('id' , tourController.checkID) ; // middleware (run before the route handler
//  and after route.express.Router())
//  , runs for any route with :id parameter

router.route('/') // route handler for /tours
.get(auth.protectRoute ,tourController.getAllTours)
.post( auth.protectRoute,tourController.createTour) ; 


 router.route('/:id')
.get(auth.protectRoute ,tourController.getOneTour)
.patch(auth.protectRoute ,tourController.updateTour) 
.delete(
    auth.protectRoute ,
    auth.restrictTo('admin') ,
    tourController.deleteTour);


module.exports = router;