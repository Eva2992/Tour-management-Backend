const User = require('./../Model/userModel') ;
const catchAsync = require ('./../helper/catchAsync') ;
const jwt = require('jsonwebtoken') ;
const AppError = require('./../helper/globalError') ;
const util = require('util') ; // to access promisify 


const signToken = id => { // parameter id 
    const token = jwt.sign({id} , process.env.JWT_SECRET ,
        {expiresIn : process.env.JWT_EXPIRES_IN
        }); //created  at login / signup

        return token ;

}

const creatAndSendToken = (user , statusCode , res) =>{
 
  const token = signToken(user._id) ;
  res.status(statusCode).json({

        status :'success',
        token ,
        data : { 
            user : user
         }

});
}


exports.signUp = catchAsync(async (req , res  ) =>{  // then mongoose validation check (password and decryption)
    const newUser = await User.create({

        name : req.body.name ,
        email : req.body.email ,
        password : req.body.password ,
        passwordConfirm : req.body.passwordConfirm ,
        role : req.body.role

    }) ;

    const token = signToken(newUser._id) ;

    


    res.status(201).json({

        status :'success',
        token ,
        data : { 
            user : newUser
         }
    });
} ) ;


exports.login =catchAsync ( async (req ,res , next) => {
    const {email , password} =req.body ;

    if(!email || !password) // checking if user put email and password 
   return  next (new AppError('Please enter email and password' , 400)) ;
   
   //find user 
   const user = await User.findOne({email}).select('+password') ; //since  password (select : false)

   //password(unharshed) , user.password(harshed)
   if(!user || !(await user.correctPassword(password , user.password)) )
   return  next (new AppError('Please enter correct  email and password' , 401)) ; 
   
   const token = signToken(user._id) ;

    res.status(201).json({

        status :'success',
        message : 'successful login' ,
        token ,
        data : { 
            user : user
         }
    });
   
} ) ;

// protectRoute Middleware 

exports.protectRoute = catchAsync ( async (req,res , next)=> {
      
    let token ;

    //1. getting token and checking if it exists

    if(req.headers.authorization &&  req.headers.authorization.startsWith('Bearer'))  {

        // sample token : authorization: 'Bearer ea9512df71.284454b491.9b53e5119f1f'

        token = req.headers.authorization.split(' ')[1] ;  } // getting 2nd part of authorization  
        //console.log(token) ;

    if(!token)
    {
        return next( new AppError('You are not logged in bro' , 401)) ;
    }

    //2. veryfing  the token
    const decoded = await util.promisify(jwt.verify)(token , process.env.JWT_SECRET) ; // promisify() converts a callback function into a Promise-based function 
    //console.log(decoded) ;

    //3. checking user exits (like user deletes account before token expires) 
    
  const currentUser = await User.findById(decoded.id); // decoded = token , token has payload which is the _id
  if (!currentUser) {
    return next(
      new AppError(
        'The user of this  token not exists ,sorry.',
        401
      )
    );
  }
   // so that restrict function can access to currentuser
    req.user = currentUser ;
    next() ;

}) ;

// restrict function  
exports.restrictTo =  (...roles) => { // roles(array) gettiing from router (roles = admin)
                                      // (...roles)  allows multiple argument collected in roles a
return (req , res , next ) => {
    if(!roles.includes(req.user.role)) {
        return next (
            new AppError('Bro ! You do not have permission to for this Action ' , 403 ) 
        );
    } 

    next(); // next middleware is the delete middleware
};

};

exports.updatePassword  = catchAsync (async (req, res,next) => {
     
    
    //getting user (before changing password , you have to be logged in , )
    //by this point authentication  is done ,so req.user is availbale from 'protectedRoute' middleware

    const user = await  User.findById(req.user._id).select('+password') ; 
    
    //
    if(!(await user.correctPassword(req.body.currentPassword , user.password))) 
     {
        return next (
            new AppError('passwords dont match' , 401 )  
        );
     }

     user.password = req.body.newPassword;
     user.passwordConfirm= req.body.newPasswordConfirm;
     await user.save() ; //password only encripted when save() is called 
                           // and password and confirmedPassword are also checked in validate funtion
    
     // re log in 
     creatAndSendToken(user , 201 , res);

     next();

}); 

/*

JWT structure -> HEADER.PAYLOAD.SIGNATURE
example ->  JIU1NiJ9 . hdAwMH0 . X7a9K...abc

=>signature is calculated from 3 parts 
1. header(algorithm info) , 
2.payload(your data) and 
3.Secret Key (JWT_SECRET) : (Never sent ,Never stored in token ,Only your server knows)

* signature :: 
-> created  at login / signup from header , payload and JWT_SECRET(only server knows jwt_secret)

-> Client just stores the signature (localStorage, cookie, etc.)

-> Sends it back to server in requests in token(header.payload.signature)

-> Server recalculates the signature to match with token's signature

-> If match then token is trusted

->any change in id with fail to match with token's signature and token will be rejected 

*** When verifying: ***

Server signs the token when user logs in/ create:

Server splits token into 3 parts

Recomputes signature using:

HMAC_SHA256(base64(header)+"."+base64(payload), JWT_SECRET)


Compares with token’s signature

✔ Match → token trusted
❌ No match → token rejected

*/