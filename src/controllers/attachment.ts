import { Response } from "express";
import { AuthRequest } from "../entities/auth.entity";
import createError from "../utils/httpError";
import response from "../utils/response";
import getImageText from "../utils/getImageText";
import uploadFile from "../utils/uploadFile";
import deleteFile from "../utils/deleteFile";


export const uploadAttachment = async (req: AuthRequest, res: Response) => {
  const { withImageText = "true" } = req.body;
  try {
    // Check file size
    const fileSizeLimit = 10 * 1024 * 1024; // 10MB
    if (!req.file || req.file.size > fileSizeLimit) {
      createError(400, 'File size exceeds the limit (10MB)');
      return response({ res, status: 400, message: 'File size exceeds the limit (10MB)' });
    }

    // Check file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      createError(400, 'Invalid file type. Only JPEG, JPG, GIF and PNG are allowed.');
      return response({ res, status: 400, message: 'Invalid file type. Only JPEG, JPG, GIF and PNG are allowed.' });
    }

    // Upload image to Cloudinary
    const result = await uploadFile(req.file.buffer);

    let imageText: String = "";
    if(withImageText === 'true') imageText = await getImageText(result.secure_url);
    // console.log(imageText);
  
    return response({ res, data: { imageUrl: result.secure_url, imageText } });
  } catch (error) {
    createError(500, error);
    return response({ res, status: 500, message: 'Server error' });
   
  }
};

export const deleteAttachment = async (req: AuthRequest, res: Response) => {
  const {imageUrl :imageUrl} = req.query;
  try {
    await deleteFile(String(imageUrl));
    
    return response({ res, message: 'File deleted successfully'});
  } catch (error) {
    console.error(error);
    return response({res, status: 500, message: String(error) });
  }
  
};