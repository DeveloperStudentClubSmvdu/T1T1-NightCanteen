import { config } from "dotenv";
config();
import app from './app.js';
import cloudinary from 'cloudinary';
import Razorpay from 'razorpay';

cloudinary.v2.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
  });

const PORT = process.env.PORT || 5015;

app.listen(PORT , () => {
    console.log(`App is running at http://localhost:${PORT}`);
});

