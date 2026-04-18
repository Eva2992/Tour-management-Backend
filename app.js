const express = require('express');
const AppError = require('./helper/globalError') ;
const globalErrorHandler = require('./controller/errorController') ; 
const cors = require('cors');    // npm install cors
const app = express();
const path = require('path') ;

const tourRouter = require('./routes/tourRouter') ;
const userRouter = require('./routes/userRouter') ;
const reviewRouter = require('./routes/reviewRouter') ;

//const morgan = require('morgan') ;

app.use(cors({
  origin: true,
  credentials: true
})); // allow all origins (dev)

// app.use(morgan('dev')); // 3rd party middleware 

app.use(express.json()) ; 

app.set('view engine' , 'pug');
app.set('views' , `${__dirname}/views`) ; //

app.use(express.static(path.join(__dirname, 'public'))) ; // serving static files


app.use((req,res , next)=> {

   // console.log('JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN);
    next() ;
});

app.get('/' ,  (req , res) =>{

    res.status(200).render('base') //rendering pug template (base.pug

})


app.use(express.static(`${__dirname}/public`)) ;
// mounting routes 


app.get('/overview' , (req, res) => {
    res.status(200).render('overview' , {
        title : 'All Tours'
    }) ;
} ) ;

app.get('/tour' , (req, res) => {
    res.status(200).render('tour' , {
        title : 'Tour Details'
    }) ;
} ) ;


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter) ;


// handling unhandled routes

 app.use( (req,res , next) => {

    next(new AppError ((`Can't find ${req.originalUrl} on this server lol hehe`) , 404)) ; // passing to next middleware 
});  

app.use(globalErrorHandler);


module.exports = app ;