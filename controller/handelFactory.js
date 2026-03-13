const catchAsync = require('./../helper/catchAsync') ;
const appError = require('./../helper/globalError') ;
const APIFeatures = require('../helper/apiFeatures') ;


exports.delete = Model =>   // function parameter is  Model
    catchAsync( async (req, res , next) => {
        let id =null ;
        if (!req.params.id) id = req.user.id ; // currently logged in user (for 'User' model only )
        else id = req.params.id ;  //

        const doc = await Model.findByIdAndDelete(id) ;

        if (!doc) {
            return next(new appError('No document found with that ID', 404)) ;
        }


        res.status(200).json({
        status : "success" ,
        massage : "Document deleted successfully" ,
    
    })   ;
}) ;

    
exports.update = Model => 
    catchAsync (async (req, res, next) => {
        let id = null ;
        if (!req.params.id) id = req.user.id ; // currently logged in user (for 'User' model only )
        else id = req.params.id ; 

     //console.log(req.body , req.params.id);
        const doc =  await Model.findByIdAndUpdate(id , req.body , {
            new : true ,
            runValidators : true 

        })  ;

        if (!doc) {
            return next(new appError('No document found with that ID', 404)) ;
        }
        
      res.status(200).json({
        status : "success" ,
        data : {
            doc
        }
    })   
    
});

exports.create = Model => 
     catchAsync (async (req , res) => {

    const doc = await Model.create(req.body) ; // Tour.create() returns a promise 

    res.status(201).json({
        status : 'success' ,
        data : {
            doc 
        }
    })
    
     
} ) ;


exports.getOne = (Model , populateOptions) => 
    catchAsync (async (req,res , next) => 
{     
   // console.log(req.params.id  , populateOptions) ;
    let query =  Model.findById(req.params.id) ;
    if(populateOptions) query = query.populate(populateOptions) ; //for review Model only (not for tour , user) , populate reviews field

    const doc = await query ;
  // console.log(doc) ;
     if (!doc) {
            return next(new appError('No document found with that ID', 404)) ;
        }

        res.status(200).json({
        status : "success" ,
        data : {
            doc 
        }
    }) ; 
} )  ;


exports.getAll = Model =>
     catchAsync(async (req, res) => {
   
    let filter = {};
    if (req.params.tourId) filter.referenceTour = req.params.tourId ;  // only for review  , sample url : {{URL}}/api/v1/tours/696d3457e/reviews
     //console.log(filter) ;                                           // so filter = { referenceTour : '696d3457e' } which will get all reviews for this tour only , 
                                                                         // for other model(tour, user)  filter = {} , for getting all reviews of all tours  filter = {} bcz there will be no tourId in paramas 


   

    const features = new APIFeatures (Model.find(filter) , req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate() ; // returns updated/manipulated  query object

    const doc = await features.query ; // finally executing the modified query lol 
    

    res.status(200).json({
        status :'success' ,
        results : doc.length ,
        data : { doc  } 

    })  
}) ;