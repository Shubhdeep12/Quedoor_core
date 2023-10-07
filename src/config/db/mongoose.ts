import { mongodb_uri } from "../config";

const mongoose = require('mongoose');

let mongodb;
const connectToMongoDB = async()=> {
  try {
    mongodb = await mongoose.connect(mongodb_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Mongodb Database connected!");

    return mongodb;
    
  } catch (error: any) {
    throw new Error(`MongoDB connection error: ${error}`);
  }
};

export default connectToMongoDB;