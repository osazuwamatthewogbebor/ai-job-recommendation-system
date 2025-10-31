import logger from "../config/logger.js";
import { uploadProfileImage, uploadResume } from "../services/uploadServices.js";


export const resumeUploader = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
        return res.status(400).json({ message: "No resume file uploaded" });
    };

    const resumeUrl = `${req.protocol}://${req.get('host')}/${req.file?.path?.replace(/\\/g, '/')}`;

    const updatedProfile = await uploadResume(userId, resumeUrl);
    if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
    };

    res.status(201).json({ message: "Resume uploaded successfully", resumeUrl});
  } catch (error) {
    res.status(500).json({ message: "Error uploading resume", error: error.message });
  };
};

export const profileImageUploader = async (req, res) => {
  try {
    const userId = req.user.id; 
    if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
    };

    const profileImageUrl = `${req.protocol}://${req.get('host')}/${req.file?.path?.replace(/\\/g, '/')}`;

    const updatedProfile = await uploadProfileImage(userId, profileImageUrl);
    if (!updatedProfile) {
        res.status(404).json({ message: "Profile not found" });
    };

    res.status(201).json({ message: "ProfileImage uploaded successfully", profileImageUrl });
  } catch (error) {
    res.status(500).json({ message: "Error uploading profileImage", error: error.message });
  };
};