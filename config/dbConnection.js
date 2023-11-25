import mongoose from 'mongoose';

mongoose.set('strictQuery' , false);

const connectToDB = async () => {

    try {
        const { connection } = await mongoose.connect(
            process.env.MONGO_URL || `mongodb://localhost:27017/lms`
        );
    
    
        if(connection){
            console.log(`Connection to MongoDB: ${connection.host}`);
        }
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
}

export default connectToDB;