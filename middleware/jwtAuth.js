import AppError from "../utils/appError.js";
import jwt from 'jsonwebtoken';

const jwtAuth = (req , res , next) => {

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
        return next(new AppError(e.message , 400));
    }

    next();
}

export default jwtAuth;