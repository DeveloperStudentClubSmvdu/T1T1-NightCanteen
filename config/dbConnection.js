// const mongoose = require('mongoose');

import mongoose from "mongoose";

// mongoose.set('strictQuery' , false);

const MONGO_URL = "mongodb://127.0.0.1:27017";

const dbConnection = () =>{

    mongoose.connect(MONGO_URL)
            .then((conn) => {
                console.log(`Connected to ${conn.connection.host}`)
            })
            .catch((e) => {
                console.log(e.messaage);
                process.exit(1);
            });
}

// module.exports = dbConnection;

export default dbConnection;