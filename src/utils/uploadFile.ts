import { v2 as cloudinary } from 'cloudinary';


const uploadFile = (buffer: Buffer): Promise<{ secure_url: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    }).end(buffer);
  });
};


export default uploadFile;