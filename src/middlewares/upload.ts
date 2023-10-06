import multer from 'multer';
console.log('imported multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;