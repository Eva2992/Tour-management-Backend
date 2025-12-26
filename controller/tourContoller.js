
const fs = require('fs');
const Tour = require('../Model/tourModel') ;
const { listen } = require('../app');


exports.createTour = async (req , res) => {
 try { 
    const newTour = await Tour.create(req.body) ; // Tour.create() returns a promise 

    res.status(201).json({
        status : 'success' ,
        data : {
            tour : newTour 
        }
    })
     }  catch (err)  {
        res.status(400).json({
            status : 'fail' ,
            massage : 'Invalid Input'
        })
     }
     
 
} ;


exports.getAllTours = async (req, res) => {
   
    try {
    //const allTour = await Tour.find() ; // see all tours 
    
    // 1.filtering 
    const queryObj = {...req.query};
    const excludeField = ['page' , 'sort' , 'limit' , 'fields'] ;
    excludeField.forEach(el => delete queryObj[el]);
    
    //2. advanced filtering

    // queryObj = { difficulty: 'easy', duration: { gte: '5' } }  
    // queryObj = { difficulty: 'easy', duration: { $gte: '5' } }  
    // to convert gte to $gte for mongoose 
     // // sample api test =  http://localhost:3000/api/v1/tours?duration[gte]=1&difficulty=easy&price[gte]=1500


    let queryStr = JSON.stringify(queryObj) ;
   
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g , match => `$${match}` ) ;
  //console.log(JSON.parse(queryStr)) ;

    let query = Tour.find(JSON.parse(queryStr)) ; 
   

    // 3. Sorting 
    // sample api test =http://localhost:3000/api/v1/tours?sort=price,ratingsAverage

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ') ; //for multiple sorting criteria like price , ratingsAverage
        query = query.sort(sortBy) ; // mongoose sort query
    } 


   // 4. Field limiting
    // sample api test = http://localhost:3000/api/v1/tours?fields=name,duration,price
    
     if(req.query.fields) { 
        const fields = req.query.fields.split(',').join(' ') ;
        query = query.select(fields) ;
     }
      
     
    // 5. Pagination
    // sample api test = http://localhost:3000/api/v1/tours?page=2&limit=2
    // page 1 = 1-2 , page 2 = 3-4 , page 3 = 5-6 (limit)

    const page = req.query.page *1 || 1 ; // default page = 1
    const limit =req.query.page *1 || 10 ;
    const skip = (page-1) * limit ;

    query= query.skip(skip).limit(limit) ;
  
    

    const tours = await query ;
    

    res.status(200).json({
        status :'success' ,
        results : tours.length ,
        data : { tours  } 

    })  }  catch(err) {

        res.status(404).json({
            status : 'fail' ,
            massage : 'Error  '
        }) ;
    } 

} ;

/*
    api : GET /api/tours?page=2&sort=price&difficulty=easy

    req.query = {
  page: '2',
  sort: 'price',
  difficulty: 'easy'  }

   => After removing excludeField , 
   => queryObj = { difficulty: 'easy'  }
   => page, sort, limit, and fields they defined how to display the results 
        
  */

exports.getOneTour = async (req,res) => 
{   
    try {
    const id = req.params.id ;
    const tour = await Tour.findById(id) ; //mongoose method to find by id

    res.status(200).json({
        status : "success" ,
        data : {
            tour 
        }
    }) } catch (err) {
        res.status(404).json({
            status : 'fail' ,
            massage : 'Tour not found'
        }) ;
    }   
}  ;

exports.updateTour = async (req, res) => {

    try {
        const tour =  await Tour.findByIdAndUpdate(req.params.id , req.body , {
            new : true ,
            runValidators : true 

        })  ;

      res.status(200).json({
        status : "success" ,
        data : {
            tour 
        }
    })   ;
    } catch (err) {
        res.status(404).json({
            status : 'fail' ,
            massage : 'Tour not found'
        }) ;

    }
};

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
            massage : 'Tour not found'
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