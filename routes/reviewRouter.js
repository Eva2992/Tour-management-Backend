const express = require('express') ;
const  reviewController = require('./../Controller/reviewController');
const auth = require('./../Controller/authController');

const router = express.Router( {mergeParams : true}) ;
  // to get access to params from parent router (tourRouter.js) 
  //POST  /tour/445464/reviews  (to get tourId from previous route)



router.route('/')
.get(auth.protectRoute,
    reviewController.getAllReviews)         // you have be logged in 
    .post(auth.protectRoute,
    auth.restrictTo('user'),
    reviewController.createReview          // onlu user can give review 
);



module.exports = router ;

