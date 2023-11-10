import express from 'express';
import { addItems } from '../controllers/item.controller.js';

const itemRouter = express.Router();

itemRouter.post('/addItems' , addItems);


export default itemRouter;