const mongoose = require('mongoose') ; // before run "npm install mongoose" in terminal
const User = require('./userModel') ;
const tourSchema = new mongoose.Schema ( { // schema definition
    name  : {
        type : String ,
        required : [true , 'A tour must have a name'] , 
        trim : true  // remove all the white spaces before and after the string
    } ,

    ratings : { 
        type : Number ,
    required : [true , "A tour must have a rating"]  ,
    default : 4.5   } , 

    price : {
        type : Number ,
        required : [ true , 'A tour must have a price']
    } ,

    priceDiscount: {
        
      type: Number } ,

      summary : {
        type : String ,
        trim : true
      } ,
        

    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"]
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficulty"
      }
    },
    
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"]
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: val => Math.round(val * 10) / 10
    },

   description : {
    type : String ,
    trim : true ,
    required : [ true , 'A tour must have a description']
   } ,

    imageCover : {
    type : String ,
    required : [ true , 'A tour must have a cover image']
   } ,

    images : [String ] , // array of strings

    createdAt : {
    type : Date ,
    default : Date.now() ,
    select : false  // hide this field from output
   } ,

    startDates : [ Date  ]  , // array of dates

    startLocation : { // embedded onject 
      type : {
             type : String ,
             default : ['Point'] ,
             enum : ['Point']
           } ,
      coordinates : [Number]   ,
      address : String ,
      description : String  
          
    } ,

  locations : [
    {
       type : {
             type : String ,
             default : ['Point'] ,
             enum : ['Point']
           } ,
      coordinates : [Number]   ,
      address : String ,
      description : String  ,
      day : Number
    }
  ] ,

  guides :  [
    {
      type : mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ]
} , 

    {
   toJSON : { virtuals : true } ,
    toObject : { virtuals : true }
    

}) ; 


//Query middleware runs before or after  query 
tourSchema.pre(/^find/ , function() {

  this.populate({
    path : 'guides' ,
    select : '-__v'///popular will convert the id with real data (User data)
  }) ;

 
}) ;


tourSchema.index({price :1 , ratingsAverage : -1}) ;

//virtuale populate 

tourSchema.virtual('reviews' , {
  ref : 'Review' ,
  foreignField : 'referenceTour' , // id of tour is saved in referenceTour
  localField : '_id' // id of the tour 
})


const Tour = mongoose.model('Tour' , tourSchema) ; // model creation

module.exports= Tour ;