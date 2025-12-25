const dotenv = require('dotenv'); // before run "npm install dotenv" in terminal 

const mongoose = require('mongoose') ;

dotenv.config({ path: './config.env' }); 

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


    

app.listen(port, () => {
    console.log(`server running at port http://localhost:${port}`);
});
