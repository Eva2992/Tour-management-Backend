const User = require('./../Model/userModel') ;
const factory = require('./handelFactory') ;


exports.deleteUser = factory.delete(User) ;
exports.updateUser = factory.update(User) ;
exports.getOneUser = factory.getOne(User) ;
exports.getAllUsers = factory.getAll(User);






/*exports.UpdateUser = catchAsync( async (req,res,next) => {


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

exports.deleteUser = catchAsync (async (req, res , next) => {

  //console.log("lol") ;
	await User.findByIdAndUpdate(req.user.id , {active : false}) ;
    
	res.status(200).json({

        status :'success',
        message : 'successfully deleted your account' 
        
        
    });
	
}) ; */