const catchAsync = require('../helper/catchAsync') ;
const appError = require('../helper/globalError') ;

exports.addToList = Model => 

    catchAsync ( async ( req , res , next )=> {

        const id = req.user.id ;

        const field = req.body.bookedTours ? 'bookedTours' : 'savedTours' ;
        const tourId = req.body.bookedTours || req.body.savedTours ;

        

        const doc = await Model.findById(id) ; // geting taht user
        if (!doc) return next(new appError('User not found', 404)) ;

        const list = doc[field] || [] ;  // getting bookedTours or savedTours list of that user 
        const alreadyExists = list
            .map(id => id.toString())
            .includes(tourId.toString());

        if (alreadyExists) {
            return next(new appError(`You have already added this tour to ${field}!`, 400));
        }

        const updated = await Model.findByIdAndUpdate(
            id,
            { $addToSet: { [field]: tourId } },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: 'success',
            data: { doc: updated }
        });
    });

exports.removeList = Model => 
    catchAsync ( async (req , res , next) => {
           
        const id = req.user.id ;

        const field = req.body.bookedTours ? 'bookedTours' : 'savedTours' ;
        const tourId = req.body.bookedTours || req.body.savedTours ;

        

        const doc = await Model.findById(id) ;
        if (!doc) return next(new appError('User not found', 404)) ;

        const list = doc[field] || [] ;  // same 
        const exists = list
            .map(id => id.toString())
            .includes(tourId.toString());

        if (!exists) {
            return next(new appError(`This tour is not in your ${field}!`, 400));
        }

        const updated = await Model.findByIdAndUpdate(
            id,
            { $pull: { [field]: tourId } },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: 'success',
            data: { doc: updated }
        });
    });

   