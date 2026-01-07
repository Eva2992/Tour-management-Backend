
const catchAsync = require('./../helper/catchAsync') ;

const Review = require('./../Model/reviewModel') ;


exports.createReview  = catchAsync ( async  ( req, res) => {

   const newReview = await  Review.create(req.body) ;

   res.status(201).json({
    status : 'success' ,
     message : "Review Created successfully" ,
     data : { newReview}

   })

});


exports.getAllReviews  = catchAsync ( async (req, res)=> {


const allReviews = await Review.find() ;

res.status(200).json({
    result : allReviews.length ,
    status : 'success' ,
     message : "All reviews" ,

     data : { allReviews }

   })

});



