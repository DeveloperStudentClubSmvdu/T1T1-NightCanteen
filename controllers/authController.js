import User from "../models/userSchema.js";
import AppError from "../utils/appError.js";
import emailValidator from 'email-validator';

const cookieOption = {
    secure : true,
    maxAge : 24*60*60*1000, // 24 Hours
    httpOnly : true
}

const signup = async (req , res, next) => {

         const { username , email , password , confirmPassword} = req.body;
         console.log( username , email , password , confirmPassword);

         try{
                // Checking every field 
                if(!username || !email || !password || !confirmPassword){
                    return next(new AppError("Every field is required" , 400));
                }
               
                // Matching the password and confirmPassword
                if(password !== confirmPassword){
                    return next(new AppError("Password and ConfirmPassword don't match", 400));
                }

                // Here validating the email 
                const validEmail = emailValidator.validate(email);

                // when given email is not valid
                if(!validEmail){
                    return next(new AppError("Email is not valid", 400));
                }

                // Cheking the user that if it is already a user or not 
                const checkUser = await User.findOne({email});

                if(checkUser){
                    return next(new AppError("Email already exists" , 400));
                }

                // if given info is new ( Means he/she is a new user) so save their data into database
                const user = await User.create({
                    username,
                    email,
                    password
                });

                // if somehow , app failed to register the user then give a message as error
                if(!User){
                    return next(new AppError("User registration faild, please try again" , 400));
                }

                // now save the user
                await user.save();

                // hide the user password as we are going to show the user details when user registered successfully
                user.password = undefined;

                res.status(200).json({
                    success : true,
                    message : "User registered successfully!",
                    userDetails : user
                });

         } catch (error) {
            // when an already register user tried to register
            if( error.code === 11000){
                return res.status(200).json({
                    success : false,
                    message : "Account already exists"

                });
            }
            return next(new AppError(error.message , 500));
         }
}

const signin = async (req , res, next) => {

    const { email , password } = req.body;

    console.log(email , password);

    if(!email || !password){
        return next(new AppError("Every field is required" , 400));
    }
    try {
        
        const user = await User.findOne({email}).select('+password');

        if(!user || await bcrypt.comparePassword(password , user.password)){
            return next(new AppError("Email or password does not match" , 400));
        }

        const token = await user.generateJWTToken();

        user.password = undefined;

        res.cookie("token" , token , cookieOption);

        res.status(200).json({
            success :true,
            message : "User logged in successfully",
            user
        })


    } catch (error) {
        return next(new AppError(error.message ,  500));
    }
}

export {

    signin,
    signup
}