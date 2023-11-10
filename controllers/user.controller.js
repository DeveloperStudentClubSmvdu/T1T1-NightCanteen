import User from "../models/user.model.js";
import AppError from "../utils/appError.js";
import emailValidator from 'email-validator';

const cookieOption = {
    secure : true,
    maxAge : 60*1000, // 1 min
    httpOnly : true
}

const register = async (req , res, next) => {

         const { username , email , password , confirmPassword} = req.body;
         console.log( username , email , password , confirmPassword);

         try{
                
                if(!username || !email || !password || !confirmPassword){
                    return next(new AppError("Every field is required" , 400));
                }
               
                
                if(password !== confirmPassword){
                    return next(new AppError("Password and ConfirmPassword don't match", 400));
                }

           
                const validEmail = emailValidator.validate(email);

              
                if(!validEmail){
                    return next(new AppError("Email is not valid", 400));
                }

                
                const checkUser = await User.findOne({email});

                if(checkUser){
                    return next(new AppError("Email already exists" , 400));
                }

               
                const user = await User.create({
                    username,
                    email,
                    password
                });

                
                if(!User){
                    return next(new AppError("User registration failed, please try again" , 400));
                }

            
                await user.save();

                // const token = await user.jwtToken();

                user.password = undefined;

                // res.cookie("token" , token , cookieOption);

                res.status(200).json({
                    success : true,
                    message : "User registered successfully!",
                    userDetails : user
                });

         } catch (error) {
            
            if( error.code === 11000){
                return res.status(200).json({
                    success : false,
                    message : "Account already exists"

                });
            }
            return next(new AppError(error.message , 500));
         }
}

const login = async (req , res, next) => {

    const { email , password } = req.body;

    console.log(email , password);

    if(!email || !password){
        return next(new AppError("Every field is required" , 400));
    }
    try {
        
        const user = await User.findOne({email}).select('+password');

        if(!user || !user.comparePassword(password)){
            return next(new AppError("Email or password does not match" , 400));
        }

        const token = await user.jwtToken();

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

const logout = async ( req, res ) => {

    res.cookie('token' , null , {
        secure : true,
        maxAge : 0,
        httpOnly : true
    });

    res.status(200).json({
        success : true,
        message : "User logged out successfully"
    });
}

const getUserDetails = async (req ,res , next) =>{

    const userId = req.user.id;

    try {
        
        const user = await User.findById(userId);

        return res.status(200).json({
            success : true,
            data : user
        });
    } catch (error) {
        return next( new AppError(error.message , 400));
    }

}

const forgotPassword = async ( req , res , next ) => {

    const { email } = req.body;

    if(!email){
        return next(new AppError('Email is required' , 400));
    }

    const user = await User.findOne({email});

    if(!user){
        return next(new AppError('Email is not registered' , 400));
    }

    const resetToken = await user.generatePasswordToken();

    await user.save();

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const subject = 'Reset Password';
    
    const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`; 

    console.log(resetPasswordUrl);

    try {
        await sendEmail(email , subject , message);

        res.status(200).json({
            success : true,
            message : `reset password token has been sent to ${email} successfully`
        });
    } catch (err) {
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;

        await user.save();

        return next(new AppError('err.message' , 500));
    }
}

const resetPassword = async (req ,res , next) => {
    const { resetToken } = req.params;

    const { password } = req.body;

    const forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry : { $gt : Date.now()}
    });

    if(!user){
        return next(new AppError('Token is invalid or expired' , 500));
    }

    user.password = password;

    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;

    await user.save();

    res.status(200).json({
        success : true,
        message : 'Password changed successfully'
    });
}

const changePassword = async function(req ,res , next){

    const { oldPassword , newPassword } = req.body;

    const { id } = req.user;

    if(!oldPassword || !newPassword){
        return next(new AppError('ALl fields are required' , 400));
    }

    const user = await User.findById(id).select('+password');

    if(!user){
        return next(new AppError('User does not exist' , 400));
    }

    const isValidPassword = await user.comparePassword(password);

    if(!isValidPassword){
        return next(new AppError('Invalid old password' , 400));
    }

    user.password = password;

    await user.save();

    user.password = undefined;

    res.status(200).json({
        success : true,
        message : 'Password changed successfully'
    })
}

const updateUser = async function(req , res , next){

    const { username } = res.body;

    const {id} = req.user;

    const user = await User.findById(id);

    if(!user){
        return next(new AppError('User does not exists' , 400));
    }

    if(username){
        user.username = username;
    }

    await user.save();

    res.status(200).json({
        success : true,
        message : 'User profile is upload successfully'
    });
}

export {

    register,
    login,
    logout,
    getUserDetails,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser
}