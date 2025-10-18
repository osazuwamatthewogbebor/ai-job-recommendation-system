import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();
const uploadDir = process.env.UPLOAD_DIR || 'uploads';

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination:  (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = ['.pdf', '.doc', '.docx'];
    const mimetype = filetypes.includes(file.mimetype);
    const extname = filetypes.includes(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Error: File upload only supports the following filetypes - ' + filetypes);
  }
});

export default upload;
