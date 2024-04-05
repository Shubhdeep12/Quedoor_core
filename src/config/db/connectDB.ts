// import connectPostCache from "../cache/postCache";
// import connectUserCache from "../cache/userCache";

import postgresConnection from "./sequelize";

const connectDB = async () => {
  
  await postgresConnection.authenticate();

  // await connectUserCache();
  // await connectPostCache();
  // await connectNewsFeedCache();

};

export default connectDB;