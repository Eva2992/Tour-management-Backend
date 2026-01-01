const express = require('express');
const router = express.Router();

const authController = require('./../Controller/authController') ;


 const usersController = require('./../Controller/userContoller') ;

// then use usersController.getAllUsers in the route handler
//router.route('/').get(usersController.getAllUsers) ;


router.post('/signup' , authController.signUp);
router.post('/login' ,authController.login) ;
router.patch('/updatePassword' , authController.protectRoute , authController.updatePassword) ;
router.patch('/updateUSer' , authController.protectRoute , usersController.UpdateUser) ;
router.delete('/deleteUser' , authController.protectRoute , usersController.deleteUser) ;
router.get('/', authController.protectRoute ,authController.restrictTo('admin') , usersController.getAllUsers); // only admin can see all users 

module.exports = router;
