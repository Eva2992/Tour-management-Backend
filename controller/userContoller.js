const User = require('./../Model/userModel') ;
const  catchAsync = require('./../helper/catchAsync') ;
const AppError = require('./../helper/globalError');

exports.getAllUsers = async (req, res) => {

	const allUsers = await User.find({ active: { $ne: false } });   // excluding the inactive users
	res.status(200).json({
		status: 'success',
		message: 'All Users :' , 
		data : { allUsers }
	});
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.UpdateUser = catchAsync( async (req,res,next) => {


if(req.body.password || req.body.passwordConfirm)
    {
        return next (
            new AppError('this route is not for update passsword' , 400 )  
        );
     }
  const nameOrEmail  = filterObj(req.body , 'name' , 'email') ; // user can only update email , name
  const updatedUser = await  User.findByIdAndUpdate(req.user._id , nameOrEmail  ,{
	new : true ,
	runValidators : true  // email validator
  } ) ; 

    res.status(200).json({

        status :'success',
        message : 'successful update' ,
        
        data : { 
            user : updatedUser
         }
    });

});

exports.deleteUser = catchAsync (async (req, res , next) => {

  console.log("lol") ;
	await User.findByIdAndUpdate(req.user.id , {active : false}) ;
    
	res.status(200).json({

        status :'success',
        message : 'successfully deleted your account' 
        
        
    });
	
}) ;