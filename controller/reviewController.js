
const catchAsync = require('./../helper/catchAsync') ;
const Review = require('./../Model/reviewModel') ;
const  factory  = require('./handelFactory') ;


exports.setTourId = (req, res, next) => {
   //  nested routes
   if (!req.body.referenceTour) req.body.referenceTour = req.params.tourId ;
   if (!req.body.referenceUser) req.body.referenceUser = req.user.id ; // from auth.protectRoute middleware
   next() ;
} ;

exports.createReview  = factory.create(Review) ;
exports.deleteReview = factory.delete(Review) ;
exports.updateReview = factory.update(Review) ;
exports.getOneReview = factory.getOne(Review) ;
exports.getAllReview = factory.getAll(Review) ;






 /*exports.createReview  = catchAsync ( async  ( req, res) => {

   if(!req.body.referenceTour) req.body.referenceTour = req.params.tourId ; // from nested route / url
   if(!req.body.referenceUser) req.body.referenceUser = req.user.id ; // from auth.protectRoute middleware
   
   const newReview = await  Review.create(req.body) ;

   res.status(201).json({
    status : 'success' ,
     message : "Review Created successfully" ,
     data : { newReview}

   });

});  
// getting all reviews for a specific tour 
exports.getAllReviews  = catchAsync ( async (req, res)=> {

const filter = {} ;
if(req.params.tourId) filter.referenceTour = req.params.tourId ; // nested route
const allReviews = await Review.find(filter) ; // if tourId present in params , get reviews for that tour only otherwisw get all reviews
//console.log(filter) ;
if (allReviews.length === 0) 
   {
   return res.status(200).send({
      message: 'No reviews found',
   });
  } 

res.status(200).json({
    result : allReviews.length ,
    status : 'success' ,
     message : "All reviews" ,

     data : { allReviews }

   });

});
*/





