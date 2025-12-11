const express = require('express');

const app = express();
const fs = require('fs');
const tourRouter = express.Router() ;

//const morgan = require('morgan') ;

// app.use(morgan('dev')); // 3rd party middleware 

app.use(express.json()) ; 


const tours = JSON.parse
(fs.readFileSync(`${__dirname}/dev-data/data/sample-tour.json`, 'utf-8')) ; 
//__dirname means current directory ../Natours , 
//Synchronously reads the file 
//Returns the file content as a Buffer or raw
//The "Sync" means it blocks/waits until the file is fully read then is converted to json 

// get all tour  api 

app.use((req,res ,next) => {
    console.log('Hello from the middleware ');
    next() ;
}) ; // middleware runs sequentially from top to bottom.
// 1st runs app.use(express.json()) , then this middleware , then the route handlers(end of response cycle)


const getAllTours =  (req, res) => {
    res.status(200).json({
        status :'success' ,
        data : {
            tours 
      } }) ;


    };



// get specific tour
    const getOneTour = (req, res) => {
        const id = parseInt(req.params.id) ;
        const tour = tours.find(el=> el.id === id ) ;
        if (!tour) {
            return res.status(404).json({error : 'Tour not found'}) ;
        }

    res.status(200).json({
        data: {
            tour
        }
      }) ;

    };


// post api 
    const createTour = (req, res) => 
        {
        const newId = tours[tours.length - 1].id + 1 ;
        
        const newtour = Object.assign({id : newId} , req.body) ;
        //Object.assign(target, source) , copies properties from a source object into  target 

        tours.push(newtour);

   //err => ...: This is the Callback Function. Since writeFile is asynchronous (non-blocking),
   // Node will run this function only after the writing is finished.

        fs.writeFile(`${__dirname}/dev-data/data/sample-tour.json` , JSON.stringify(tours, null, 2) , err =>
            
            //Converts the tours array to a JSON string , "null" means include all properties (no filtering , 
            //2 means indent using 2 spaces for readability
            {
            if (err) {
                return res.status(500).json({error : 'Failed to save new tour'}) ;
            }

            res.status(201).json({
                status : 'success' ,
                data :{
                    tours : newtour 
                      }   });
            } ) ;
    };

//delete api 
    const deleteTour = (req, res) => {
    const id = parseInt(req.params.id);
   
    const tourIndex = tours.findIndex(el => el.id === id);
    
    if (tourIndex === -1) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    // .splice(index, 1) removes 1 element at that index
    tours.splice(tourIndex, 1);

    fs.writeFile(`${__dirname}/dev-data/data/sample-tour.json`, JSON.stringify(tours, null, 2), err => {
        
        res.status(204).json({
            status: 'success',
            massage : 'Tour deleted successfully' 
        });
    });
};

// get all users api
const getAllUsers = (req, res) => {
    res.status(200).json({
        status :'success' ,
        message : 'This route is not yet defined ' 
      }) ;
    };

app.use('/api/v1/tours' ,tourRouter) ; // Route mounting

 tourRouter.route('/')
 .get(getAllTours)
 .post(createTour) ;


 // app.route('/api/v1/tours').get(getAllTours) // alternative of prev codes


tourRouter.route('/:id')
    .get(getOneTour)
    .delete(deleteTour) ;


//app.get('/api/v1/tours', getAllTours) ; // alternative of app.route('/api/v1/tours') .get(getAllTours) 
//app.get('/api/v1/tours/:id', getOneTour) ;
//app.post('/api/v1/tours', createTour) ;
//app.delete('/api/v1/tours/:id', deleteTour) ;

app.route('/api/v1/users') .get(getAllUsers) 


const port = 3000 ;




app.listen(port , () => {
    console.log(`server running at port http://localhost:${port}`);
}) ;
