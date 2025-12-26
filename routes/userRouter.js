const express = require('express');
const router = express.Router();

const { getAllUsers } = require('../Controller/userContoller') ; 

// const usersController = require('./../controller/userContoller') ;
// then use usersController.getAllUsers in the route handler
//router.route('/').get(usersController.getAllUsers) ;


router.route('/')
.get(getAllUsers);

module.exports = router;
