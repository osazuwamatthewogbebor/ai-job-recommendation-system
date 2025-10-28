import multer from 'multer';
import path from 'path';
import fs from 'fs';
import APP_CONFIG from '../config/APP_CONFIG.js';
import AppError from '../utils/AppError.js';


const uploadDir = APP_CONFIG.UPLOAD_DIR || 'uploads';

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
};

const storage = multer.diskStorage({
  destination:  (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});


const fileFilter = (req, file, cb) => {
  
  let filetypes = [];

  if (file.fieldname === 'resume') {
    filetypes = ['.pdf', '.doc', '.docx'];
  } else if (file.fieldname === 'profileImage') {
    filetypes = ['.jpg', '.jpeg', '.png', '.gif'];
  } else {
    return cb(new AppError("Unknown upload field", 400));
  };

  const ext = path.extname(file.originalname).toLowerCase();
  
  if (filetypes.includes(ext)) return cb(null, true);

  cb(new AppError(`Error: File upload only supports the following filetypes - ${filetypes.join(', ')}`, 400));
};


const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

export default upload;
