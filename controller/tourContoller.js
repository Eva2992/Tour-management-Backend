
const fs = require('fs');
const Tour = require('../Model/tourModel') ;
const { listen } = require('../app');
const APIFeatures = require('../helper/apiFeatures') ;
const catchAsync = require('./../helper/catchAsync') ;



exports.createTour = catchAsync (async (req , res) => {

    const newTour = await Tour.create(req.body) ; // Tour.create() returns a promise 

    res.status(201).json({
        status : 'success' ,
        data : {
            tour : newTour 
        }
    })
    
     
} ) ;



// get api to see all tours 
exports.getAllTours = catchAsync(async (req, res) => {
   
    
    
    const features = new APIFeatures (Tour.find() , req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate() ; // returns updated/manipulated  query object

    const tours = await features.query ; // finally executing the modified query lol 
    

    res.status(200).json({
        status :'success' ,
        results : tours.length ,
        data : { tours  } 

    })  
}) ;



exports.getOneTour = catchAsync (async (req,res) => 
{   
   
    const id = req.params.id ;
    const tour = await Tour.findById(id) ; //mongoose method to find by id

    res.status(200).json({
        status : "success" ,
        data : {
            tour 
        }
    }) 
} )  ;

exports.updateTour = catchAsync (async (req, res) => {

   
        const tour =  await Tour.findByIdAndUpdate(req.params.id , req.body , {
            new : true ,
            runValidators : true 

        })  ;

      res.status(200).json({
        status : "success" ,
        data : {
            tour 
        }
    })   
    
});

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id) ;
        res.status(200).json({
        status : "success" ,
        massage : "Tour deleted successfully" ,
    
    })   ;
    } catch (err) {
        res.status(404).json({
            status : 'fail' ,
            massage : 'Tour not found' // not a global error handler
        }) ;
    }
};
    



/* const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/sample-tour.json`, 'utf-8')
);
__dirname means current directory ../Natours , 
Synchronously reads the file 
Returns the file content as a Buffer or raw
The "Sync" means it blocks/waits until the file is fully read then is converted to json 

app.use((req,res ,next) => {
   console.log('Hello from the middleware ');
    next() ;
}) ; // middleware runs sequentially from top to bottom.
 1st runs app.use(express.json()) , then this middleware , then the route handlers(end of response cycle) 

exports.checkID = ( req, res , next , val) => 
{
   const id = parseInt(req.params.id, 10);
    const tour = tours.find((el) => el.id === id);
    if (!tour) {
        return res.status(404).json({ status: 'fail', message: 'Tour not found here ' });
    }
    next() ;
} 


// get all tour 

exports.getAllTours =  (req, res) => {
    res.status(200).json({
        status :'success' ,
        data : {
            tours 
      } }) ;


    };



// get specific tour
    exports.getOneTour = (req, res) => {

    const id = parseInt(req.params.id, 10);
    const tour = tours.find((el) => el.id === id);
    if (!tour) {
        return res.status(404).json({ status: 'fail', message: 'Tour not found' });
    }

    res.status(200).json({ status: 'success', data: { tour } });

    };
    
// adding middleware for checking validity for post handlers 

exports.checkBody = (req, res  , next ) => {
    if (!req.body.name || !req.body.price ) {
        return res.status(400).json({ status: 'fail', 
            message: 'Missing name or price' });
    }

    
    next() ; // proceed to next route handler (createTour)
}

/* // post api 

    exports.createTour = (req, res) => 
        {
        const newId = tours.length ? tours[tours.length - 1].id + 1 : 1;

        const newtour = Object.assign({ id: newId }, req.body);
        //Object.assign(target, source) , copies properties from a source object into  target 

        tours.push(newtour);

   //err => ...: This is the Callback Function. Since writeFile is asynchronous (non-blocking),
   // Node will run this function only after the writing is finished.

        fs.writeFile(
          `${__dirname}/../dev-data/data/sample-tour.json`,
          JSON.stringify(tours, null, 2),
          (err) =>
            
            //Converts the tours array to a JSON string , "null" means include all properties (no filtering , 
            //2 means indent using 2 spaces for readability
            {
            if (err) {
                return res.status(500).json({ status: 'error', message: 'Failed to save new tour' });
            }

            res.status(201).json({ status: 'success', data: { tour: newtour } });
            } ) ;
    };

//delete api 
    exports.deleteTour = (req, res) => {
    const id = parseInt(req.params.id, 10);

    const tourIndex = tours.findIndex((el) => el.id === id);

    if (tourIndex === -1) {
        return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
    }
    // .splice(index, 1) removes 1 element at that index
    tours.splice(tourIndex, 1);

    fs.writeFile(
        `${__dirname}/../dev-data/data/sample-tour.json`,
        JSON.stringify(tours, null, 2),
        (err) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: 'Failed to delete tour' });
            }

            res.status(204).json({ status: 'success', 
                massage : 'Tour deleted successfully' 
             });
        }
    );
};

// patch api 
exports.updateTour =(req , res ) => {
    const id = parseInt(req.params.id, 10);

    const tour = tours.find((el) => el.id === id);  // contains the tour object to be updated 

    if (!tour) {
        return res.status(404).json({ status: 'fail', message: 'Tour not found' });
    }  
    
    Object.assign(tour , req.body) ; // updates the tour object with new data from req.body


   fs.writeFile(`${__dirname}/../dev-data/data/sample-tour.json` ,
   JSON.stringify(tours , null , 2) ,
   (err) => {
    if (err) {
        return res.status(500).json({ status: 'error', message: 'Failed to update tour' });
    }

    res.status(200).json({
        status: 'success',
        data : tour // return the updated tour object
    } ) ;
   } ) ;    

} */