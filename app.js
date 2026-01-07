const express = require('express');
const AppError = require('./helper/globalError') ;
const globalErrorHandler = require('./Controller/errorController') ;    
const app = express();

const tourRouter = require('./routes/tourRouter') ;
const userRouter = require('./routes/userRouter') ;
const reviewRouter = require('./routes/reviewRouter') ;

//const morgan = require('morgan') ;

// app.use(morgan('dev')); // 3rd party middleware 

app.use(express.json()) ; 


app.use((req,res , next)=> {

   // console.log('JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN);
    next() ;
});


app.use(express.static(`${__dirname}/public`)) ;
// mounting routes 
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter) ;


// handling unhandled routes

 app.use( (req,res , next) => {

    next(new AppError ((`Can't find ${req.originalUrl} on this server lol hehe`) , 404)) ; // passing to next middleware 
});  

app.use(globalErrorHandler);


module.exports = app ;