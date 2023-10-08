// const app = require('./app');
// import { config } from "dotenv";
import app from './app.js';

// config();

const PORT = process.env.PORT || 5015;

app.listen(PORT , () => {
    console.log(`App is running at http://localhost:${PORT}`);
});

