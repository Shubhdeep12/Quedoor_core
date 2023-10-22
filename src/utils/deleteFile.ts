import { v2 as cloudinary } from 'cloudinary';

import createError from './httpError';

const deleteFile = async (image_url: String) => {
  try {
    const regexPattern = /\/v\d+\/([^/]+)\./;
    const match = image_url.match(regexPattern);

    if (match && match[1]) {
      const publicId = match[1];
      console.log("Public ID:", publicId);
      const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
      if (result.result !== 'ok') {
     
        throw new Error('File not found in Cloudinary');
      }
    } else {
      throw new Error('Invalid secure URL');
    }
  } catch (error) {
    createError(500, String(error));
    throw new Error(String(error));
  }
};

export default deleteFile;