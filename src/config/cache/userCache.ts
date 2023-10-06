const redis = require('redis');
import { redis_uri } from '../config';

const userCache = redis.createClient({
  url: `${redis_uri}/0`
});

userCache.on('connect', () => {
  console.log('User Cache Connected to Redis server');
});

userCache.on('error', (err: any) => {
  console.error('Redis connection error:', err);
});


const connectUserCache = async () => {
  userCache.connect();
};

export const getUserCache = () =>{
  if (!userCache) {
    throw new Error('user cache driver not initialized.');
  }

  return userCache;
};


export default connectUserCache;