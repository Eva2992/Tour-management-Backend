const AppError = require('./../helper/globalError');
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);


const globalErrorHandler = ( err, req , res , next) => {

    err.statusCode = err.statusCode || 500 ;
    err.status = err.status || 'error' ; 

    // jwt error 
    if (err.name === 'JsonWebTokenError')
      err = handleJWTError();

    if (err.name === 'TokenExpiredError')
      err = handleJWTExpiredError();


    res.status(err.statusCode).json({
        status : err.status ,
        message : err.message
    }) ;    
};

module.exports = globalErrorHandler ;