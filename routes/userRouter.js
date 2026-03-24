const express = require('express');
const router = express.Router();

const authController = require('./../Controller/authController') ;


 const usersController = require('./../Controller/userContoller') ;

const User = require('./../Model/userModel') ;



router.post('/signup' , authController.signUp);
router.post('/login' ,authController.login) ;
router.patch('/updatePassword' , authController.protectRoute , authController.updatePassword) ;
router.patch('/updateUser' , authController.protectRoute , usersController.updateUser) ;
router.delete('/deleteUser' , authController.protectRoute , usersController.deleteUser) ;
router.get('/me', authController.protectRoute, usersController.getMe, usersController.getOneUser) ;
router.get('/', authController.protectRoute ,authController.restrictTo('admin') , usersController.getAllUsers); // only admin can see all users 
router.get('/:id', authController.protectRoute , authController.restrictTo('admin') , usersController.getOneUser);
router.patch('/add-tour' , authController.protectRoute , usersController.addtoList) ;
router.patch('/remove-tour' , authController.protectRoute , usersController.removeFromList) ;
router.patch('/updateUserbyAdmin/:id' , authController.protectRoute , authController.restrictTo('admin') , usersController.updateUser) ;
router.delete('/deleteUserbyAdmin/:id' , authController.protectRoute , authController.restrictTo('admin') , usersController.deleteUser) ;
module.exports = router;
