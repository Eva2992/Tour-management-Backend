const mongoose = require('mongoose') ;

const reviewSchema =  new mongoose.Schema ( {
    

    review : {
        type :String ,
        required : [true , 'Review cannot be empty']
    },

    rating : {
        type : Number  , 
        required : true  ,
        min : 1 ,
        max : 5
    } ,

    createAt : {
        type :  Date ,    
        default : Date.now
    } ,
    referenceTour  :  // parent reference 
        {
            type : mongoose.Schema.ObjectId ,
            ref : 'Tour' ,
            required : [true , 'Reference a tour ']
        },
    

     referenceUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Reference a User']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// query middleware

reviewSchema.pre(/^find/ , function() {

    this.populate({
        path : 'referenceTour' ,
        ref : 'Tour' ,
        select : 'name'
    });
    this.populate({
        path : 'referenceUser' ,
        ref : 'User'  ,
        select : 'name photo' 
    })
    
     // this takes more time in api request 
});


const Review = mongoose.model ('Review' , reviewSchema) ;

module.exports = Review ;

