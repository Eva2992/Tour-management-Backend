const mongoose = require('mongoose') ; // before run "npm install mongoose" in terminal

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
    }

}) ; 

const Tour = mongoose.model('Tour' , tourSchema) ; // model creation

module.exports= Tour ;