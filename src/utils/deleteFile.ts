import { v2 as cloudinary } from 'cloudinary';
import createError from './httpError';


const deleteFile = async (imageUrl: String) => {
  try {
    const parts = imageUrl.split('/');
    const publicId = parts[parts.length - 1].split('.')[0];
    console.log(publicId);
    if (!publicId) {
      throw new Error('Invalid secure URL');
    }
    const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
    if (result.result !== 'ok') {
   
      throw new Error('File not found in Cloudinary');
    }
  } catch (error) {
    createError(500, String(error));
    throw new Error(String(error));
  }
};

export default deleteFile;