const express = require('express');
const AppError = require('./helper/globalError') ;
const globalErrorHandler = require('./Controller/errorController') ;    
const app = express();

const tourRouter = require('./routes/tourRouter') ;
const userRouter = require('./routes/userRouter') ;



//const morgan = require('morgan') ;

// app.use(morgan('dev')); // 3rd party middleware 

app.use(express.json()) ; 

app.use(express.static(`${__dirname}/public`)) ;

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


// handling unhandled routes

 app.use( (req,res , next) => {

    next(new AppError ((`Can't find ${req.originalUrl} on this server lol hehe`) , 404)) ; // passing to next middleware 
});  

app.use(globalErrorHandler);


module.exports = app ;