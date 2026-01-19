const express = require('express') ;
const  reviewController = require('./../Controller/reviewController');
const auth = require('./../Controller/authController');

const router = express.Router( {mergeParams : true}) ;
  // to get access to params from parent router (tourRouter.js) 
  //POST  /tour/445464/reviews  (to get tourId from previous route)



router.route('/')
.post(auth.protectRoute,
    auth.restrictTo('user'),
    reviewController.setTourId,
    reviewController.createReview )       // onlu user can give review );
.get(auth.protectRoute , reviewController.getAllReview) ;


router.route('/:id')
.delete(auth.protectRoute , reviewController.deleteReview)   
.patch(auth.protectRoute , reviewController.updateReview) 
.get(auth.protectRoute , reviewController.getOneReview) ;

module.exports = router ;

