// require('dotenv').config();
// const express = require('express');
import express from 'express';
import dbConnection from './config/dbConnection.js';
import authRouter from './routes/authRoute.js';
// const dbConnection = require('./config/dbConnection');

const app = express();

dbConnection();

app.use('/' , ( req ,res) => {

    res.status(200).json({
        data : "Welcome to the Night Craving Food Canteen !!"
    })
});

app.use('/' , authRouter);

export default app;