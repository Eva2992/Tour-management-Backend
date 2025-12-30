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
exports.signUp = catchAsync(async (req , res  ) =>{  // then mongoose validation check (password and decryption)
    const newUser = await User.create({

        name : req.body.name ,
        email : req.body.email ,
        password : req.body.password ,
        passwordConfirm : req.body.passwordConfirm

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
   const user = await User.findOne({email}).select('+password') ; // password (select : false)

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


exports.protectRoute = catchAsync ( async (req,res , next)=> {
      
    let token ;

    //1. getting token and checking if it exists

    if(req.headers.authorization &&  req.headers.authorization.startsWith('Bearer'))  {

        // sample  authorization: 'Bearer ea9512df-7128-4454-b491-9b53e5119f1f'

        token = req.headers.authorization.split(' ')[1] ;  } // getting 2nd part of authorization  
        //console.log(token) ;

    if(!token)
    {
        return next( new AppError('You are not logged in bro' , 401)) ;
    }

    //2. veryfing  the token
    const decoded = await util.promisify(jwt.verify)(token , process.env.JWT_SECRET) ;
    //console.log(decoded) ;

    //3. checking user exits (like user deletes account before token expires) 
    
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user of this  token not exists ,sorry.',
        401
      )
    );
  }

    next() ;

}) ;

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