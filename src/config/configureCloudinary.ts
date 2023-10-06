// cloudinaryConfig.ts
import { v2 as cloudinary } from 'cloudinary';
import { cloud_key, cloud_name, cloud_secret } from './config';

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: cloud_name,
    api_key: cloud_key,
    api_secret: cloud_secret,
  });
};

export default configureCloudinary;