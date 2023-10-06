import express from "express";
import verifyToken from "../middlewares/verifyToken";
import { deleteAttachment, uploadAttachment } from "../controllers/attachment";
import upload from "../middlewares/upload";

const router = express.Router();

router.post("/", verifyToken, upload.single('image'), uploadAttachment);
router.delete("/", verifyToken, deleteAttachment);

export default router;

// import {v2 as cloudinary} from 'cloudinary';
          
// cloudinary.config({ 
// cloud_name: 'quedoor', 
// api_key: '695598189821642', 
// api_secret: '2Oy7VGoXQz1OurR_ZAmw_cQCz_g' 
// });