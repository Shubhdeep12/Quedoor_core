const redis = require('redis');
import { redis_uri } from '../config';

const newsFeedCache = redis.createClient({
  url: `${redis_uri}/0`
});

newsFeedCache.on('connect', () => {
  console.log('NewsFeed Cache Connected to Redis server');
});

newsFeedCache.on('error', (err: any) => {
  console.error('Redis connection error:', err);
});


const connectNewsFeedCache = async () => {
  newsFeedCache.connect();
}

export const getNewsFeedCache = () =>{
  if (!newsFeedCache) {
    throw new Error('newsFeed cache driver not initialized.');
  }

  return newsFeedCache;
}


export default connectNewsFeedCache;