const mongoose = require('mongoose') ;
const validator = require('validator'); // run npm install validator

const bcrypt = require('bcryptjs'); // run npm install bcryptjs

const userSchema = new mongoose.Schema  ( {

    name : {
        type : String ,
        required : [true , 'Please provide your name'] ,
        
    } ,

    password :{
        type : String ,
        required : [true , 'Please provide your email'] ,
        select : false ,
        minlength : 8 
    },

    email : {
        type : String ,
        required : [true ,'Email is required'],
        unique : true ,
        lowercase : true ,
        validate : [validator.isEmail , 'Please provide a valid email']
        
    } ,

    photo :
    {
        type : String  
        
    },
    
    role : {
        type : String ,
        enum : ['user' , 'guide' , 'admin' ] ,
        default : 'user'
    } ,


    passwordConfirm : { // it is used only for checking the validation , not saved in the database
        type : String ,
        required : [true , 'Please Confirm your password'] ,
        validate: {
        // they are bundled together
        validator: function(el) {
            return el === this.password;
        },
        message: 'Passwords are not the same'  }
        
    }
}); 

//pre-save middleware
userSchema.pre('save' , async function () {

    if( !this.isModified('password'))  return   ;
   
    // Only run this function if password was actually modified not when  name/email is  updated
    this.password = await bcrypt.hash(this.password ,12); // returns a promise 
// 12 -> cost , the more the more secure , slower

    this.passwordConfirm = undefined ;
    

} ) ;


userSchema.methods.correctPassword = async function (receivedPassword , userPassword) {

    return await bcrypt.compare(receivedPassword , userPassword);
} ;

const User = mongoose.model('User' , userSchema);

module.exports = User ;