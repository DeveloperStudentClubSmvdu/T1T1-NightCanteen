import AppError from "../utils/appError.js";
import jwt from 'jsonwebtoken';

const isLoggedIn = (req , res , next) => {

    const token = ( req.cookies && req.cookies.token) || null;
    console.log(token);
    
    if( ! token ){
        return next(new AppError("Not Authorized! please login" , 400));
    }
    try {
        
        const payload = jwt.verify(token , process.env.JWT_SECRET);

        if( !payload){
            return next(new AppError("Not Authorized! please login" , 400));
        }

        req.user = { id : payload.id , email: payload.email};


    } catch (error) {
        return next(new AppError(error.message , 400));
    }

    next();
}

const authorizedRoles = (...roles) => (req , res , next) => {

    const currentRole = req.user.id;

    if(!roles.includes(currentRole)){
        return next(new AppError('You have no permission to access this route'  , 500));
    }

    next();
}

export {
    isLoggedIn,
    authorizedRoles
}