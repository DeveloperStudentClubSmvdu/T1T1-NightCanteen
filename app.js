import express from 'express';
import dbConnection from './config/dbConnection.js';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoute from './routes/user.routes.js';
import itemsRoute from './routes/items.routes.js';
import errorMiddleware from './middleware/error.middleware.js';
import cors from 'cors';
const app = express();

dbConnection();

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credential: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

app.get('/' , ( req ,res) => {

    res.send("<h1 style='color:red;''> Welcome to the Night Craving Home Page </h1>")
});

app.use('/api/auth/user' , userRoute);
app.use('/api/auth/items' , itemsRoute);
app.use('*' , (req, res) => {
    res.status(404).send('Oops!! 404 page not found');
});

app.use(errorMiddleware);

export default app;