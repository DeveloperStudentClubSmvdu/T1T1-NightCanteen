// require('dotenv').config();
// const express = require('express');
import express from 'express';
import dbConnection from './config/dbConnection.js';
import authRouter from './routes/authRoute.js';
// const dbConnection = require('./config/dbConnection');
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser';

const app = express();

dbConnection();

app.use(cookieParser());
app.use(express.json());

app.get('/' , ( req ,res) => {

    res.send("<h1 style='color:red;''> Welcome to the Night Craving Home Page </h1>")
});

app.use('/api/auth' , authRouter);

export default app;