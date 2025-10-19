import express from 'express';
import upload from '../middleware/multerSetup.js';
import Resume from '../models/Resume.js';

const router = express.Router();
router.post('/uploadResume', upload.single('resume'), async (req, res) => {
  try {
    const userId = req.body.userId; 
    const filePath = req.file.path;

    // Create a new resume entry in the database
    const newResume = new Resume({
      user: userId,
      filePath: filePath
    });

    await newResume.save();

    res.status(201).json({ message: 'Resume uploaded successfully', resume: newResume });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading resume', error: error.message });
  }
});

export default router;   