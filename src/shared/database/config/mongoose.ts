const mongoose = require('mongoose');
import { mongodb_uri } from '../../config';

let mongodb;
const connectToMongoDB = async()=> {
  try {
    
  // Create a new Mongoose connection and connect to MongoDB
    mongodb =  await mongoose.connect(mongodb_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    });

    console.log("Mongodb Database connected!");

    return mongodb;
    
  } catch (error: any) {
    throw new Error(`MongoDB connection error: ${error}`);
  }
}

export default connectToMongoDB;