import express from 'express';
import upload from '../middleware/multerSetup.js';
import { profileImageUploader, resumeUploader } from '../controllers/uploadControllers.js';

const router = express.Router();

router.post("/resume", upload.single("resume"), resumeUploader);
router.post("/profile-image", upload.single("profileImage"), profileImageUploader);


export default router;   