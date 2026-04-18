const express = require('express');

const router = express.Router(); // 1st run express router

const tourController = require('../controller/tourContoller') ; // exported from tourContoller.js)
const auth = require('./../controller/authController');

const reviewRouter = require('./reviewRouter') ;


//router.param('id' , tourController.checkID) ; // middleware (run before the route handler
//  and after route.express.Router())
//  , runs for any route with :id parameter

router.use('/:tourId/reviews' , reviewRouter) ; // if found /:tourId/reviews in the url , forward to reviewRouter (middleware)
                                                  // nested routes using express

router.route('/') // route handler for /tours
.get(tourController.getAllTours)
.post( auth.protectRoute,
    auth.restrictTo('admin' , 'guide') ,
    tourController.createTour) ; 


router.route('/:id')
.get(tourController.getOneTour)
.patch(auth.protectRoute ,
    auth.restrictTo('admin' , 'guide') ,
    tourController.updateTour)
.delete(
    auth.protectRoute ,
    auth.restrictTo('admin') ,
    tourController.deleteTour);



module.exports = router;