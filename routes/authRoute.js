// const express = require('express');
import express from 'express';

// const { signin , signup } = require('../controllers/authController');
import { getUserDetails, signin, signup } from '../controllers/authController.js';
import jwtAuth from '../middleware/jwtAuth.js';

const authRouter = express.Router();

authRouter.post('/signup' ,  signup);
authRouter.post('/signin' , signin);
authRouter.get('/me' , jwtAuth, getUserDetails);


export default authRouter;