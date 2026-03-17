const express = require('express') ;
const  reviewController = require('./../Controller/reviewController');
const auth = require('./../Controller/authController');

const router = express.Router( {mergeParams : true}) ;
  // to get access to params from parent router (tourRouter.js) 
  //POST  /tour/445464/reviews  (to get tourId from previous route)



router.route('/')
.post(auth.protectRoute,
    auth.restrictTo('user'),
    reviewController.setTourId,         //using the mddleware to get tourId and userId in req.body
    reviewController.createReview )       // onlu user can give review );
.get( reviewController.getAllReview) ;


router.route('/:id')
.delete(auth.protectRoute , 
    auth.restrictTo('user' ,'admin'),
    reviewController.deleteReview)   
.patch(auth.protectRoute , 
    auth.restrictTo('user' ,'admin'),
    reviewController.updateReview) 
.get(  reviewController.getOneReview) ;

module.exports = router ;

