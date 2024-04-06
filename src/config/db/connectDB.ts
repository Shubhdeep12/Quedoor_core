// import connectPostCache from "../cache/postCache";
// import connectUserCache from "../cache/userCache";

import syncDB from "./syncDB";
import postgresConnection from "./sequelize";

const connectDB = async () => {
  
  try {
    
    await postgresConnection.authenticate();
    await syncDB();
  }
  catch (e) {
    console.log(e);
  }

  // await connectUserCache();
  // await connectPostCache();
  // await connectNewsFeedCache();

};

export default connectDB;