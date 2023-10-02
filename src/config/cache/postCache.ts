const redis = require('redis');
import { redis_uri } from '../config';

const postCache = redis.createClient({
  url: `${redis_uri}/1`
});

postCache.on('connect', () => {
  console.log('Post Cache Connected to Redis server');
});

postCache.on('error', (err: any) => {
  console.error('Redis connection error:', err);
});


const connectPostCache = async () => {
  postCache.connect();
}

export const getPostCache = () =>{
  if (!postCache) {
    throw new Error('post cache driver not initialized.');
  }

  return postCache;
}


export default connectPostCache;