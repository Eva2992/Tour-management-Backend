const express = require('express');

const app = express();

const tourRouter = require('./routes/tourRouter') ;
const userRouter = require('./routes/userRouter') ;



//const morgan = require('morgan') ;

// app.use(morgan('dev')); // 3rd party middleware 

app.use(express.json()) ; 
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app ;