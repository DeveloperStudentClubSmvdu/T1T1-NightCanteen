// const express = require('express');
import express from 'express';

// const { signin , signup } = require('../controllers/authController');
import { signin, signup } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/signup' ,  signup);
authRouter.get('/signup' ,  signup);
authRouter.post('/signin' , signin);
authRouter.get('/signin' , signin);


export default authRouter;