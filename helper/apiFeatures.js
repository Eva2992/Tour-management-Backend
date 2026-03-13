class APIFeatures {
    constructor (query , queryString) { // we will be modifying the 'query' through 
                                        // each filter before executing it at the end
         this.query = query ;            // queryString is 'req.query' which are sort, field, page, limit , etc from url
        this.queryString = queryString ;
    }

    filter () {
        
        // 1.filtering
        const queryObj = { ...this.queryString} ; //example : { difficulty: 'easy', duration: '5'  }
    const excludeField = ['page' , 'sort' , 'limit' , 'fields'] ;
    excludeField.forEach(el => delete queryObj[el]);
    
     // ADD THIS — convert name to regex before querying
  if (queryObj.name) {
    queryObj.name = { $regex: queryObj.name, $options: 'i' };
  } 


    //2. advanced filtering

    // queryObj = { difficulty: 'easy', duration: { gte: '5' } }  
    // queryObj = { difficulty: 'easy', duration: { $gte: '5' } }  
    // to convert gte to $gte for mongoose 
     // // sample api test =  http://localhost:3000/api/v1/tours?duration[gte]=1&difficulty=easy&price[gte]=1500


    let queryStr = JSON.stringify(queryObj) ;
   
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g , match => `$${match}` ) ;
  //console.log(JSON.parse(queryStr)) ;

    this.query = this.query.find (JSON.parse (queryStr)) ; // mongoose query 

    return this ;

    }

   sort () {
   // 3. Sorting 
    // sample api test =http://localhost:3000/api/v1/tours?sort=price,ratingsAverage

    if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ') ; //for multiple sorting criteria like price , ratingsAverage
        this.query = this.query.sort(sortBy) ; // mongoose sort query
    } 

    return this ;
  } 

    limitFields() {
   // 4. Field limiting
    // sample api test = http://localhost:3000/api/v1/tours?fields=name,duration,price
    
     if(this.queryString.fields) { 
        const fields = this.queryString.fields.split(',').join(' ') ;
        this.query = this.query.select(fields) ;
     }
        return this ;
    }
     

    paginate() {
    // 5. Pagination
    // sample api test = http://localhost:3000/api/v1/tours?page=2&limit=2
    // page 1 = 1-2 , page 2 = 3-4 , page 3 = 5-6 (limit)

    const page = this.queryString.page *1 || 1 ; // default page = 1
    const limit =this.queryString.limit *1  ;
    const skip = (page-1) * limit ;

    this.query= this.query.skip(skip).limit(limit) ;
    
    return this ; 
    }


}
module.exports = APIFeatures ;