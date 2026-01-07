const express = require('express') ;
const  reviewController = require('./../Controller/reviewController');
const auth = require('./../Controller/authController');

const router = express.Router()  ;

router.route('/')
.get(auth.protectRoute,
    reviewController.getAllReviews)         // you have be logged in 
.post(auth.protectRoute,
    auth.restrictTo('user'),
    reviewController.createReview          // onlu user can give review 
);


module.exports = router ;

