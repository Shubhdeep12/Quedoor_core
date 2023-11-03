import { Response } from "express";
import { AuthRequest } from "../entities/auth.entity";
import createError from "../utils/httpError";
import response from "../utils/response";
import getImageText from "../utils/getImageText";
import uploadFile from "../utils/uploadFile";
import deleteFile from "../utils/deleteFile";


export const uploadAttachment = async (req: AuthRequest, res: Response) => {
  const { with_image_text = "true" } = req.body;
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

    let image_text: String = "";
    if(with_image_text === 'true') image_text = await getImageText(result.secure_url);
    // console.log(image_text);
  
    return response({ res, data: { image_url: result.secure_url, image_text } });
  } catch (error) {
    createError(500, String(error));
    return response({ res, status: 500, message: 'Server error' });
   
  }
};

export const deleteAttachment = async (req: AuthRequest, res: Response) => {
  const {image_url :image_url} = req.query;
  try {
    await deleteFile(String(image_url));
    
    return response({ res, message: 'File deleted successfully'});
  } catch (error) {
    console.error(error);
    return response({res, status: 500, message: String(error) });
  }
  
};