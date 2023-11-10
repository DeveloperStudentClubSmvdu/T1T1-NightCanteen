import express from 'express';
import { changePassword, forgotPassword, getUserDetails, login, logout, resetPassword, updateUser, register } from '../controllers/user.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/register' ,  register);
authRouter.post('/login' , login);
authRouter.get('/logout' , logout);
authRouter.get('/me' , isLoggedIn, getUserDetails);
authRouter.post('/reset' , forgotPassword);
authRouter.post('/reset/:resetToken' , resetPassword);
authRouter.post('/change-password' , isLoggedIn , changePassword);
authRouter.put('/update' , isLoggedIn , updateUser);


export default authRouter;