const dotenv = require('dotenv'); // before run "npm install dotenv" in terminal 

dotenv.config({ path: './config.env' }); 
const mongoose = require('mongoose') ; // before run "npm install mongoose" in terminal
const app = require('./app');

const port = 3000;

dotenv.config({path : './config.env'}) ;
const DB = process.env.DATABASE.replace(
    '<PASSWORD>' , process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(con => {
   // console.log(con.connections) ;
    console.log('DB connection successful') ;
}) ;

console.log(process.env.NODE_ENV) ;


app.listen(port, () => {
    console.log(`server running at port http://localhost:${port}`);
});
