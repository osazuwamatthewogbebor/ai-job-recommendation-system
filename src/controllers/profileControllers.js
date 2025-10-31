import logger from "../config/logger.js";
import {
  createProfileService,
  getProfileService,
  updateProfileService,
  deleteAccountService,
} from "../services/profileService.js";
import cacheManager from "../utils/cacheManager.js";

export const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    delete profileData.id;
    delete profileData.userId

    let resumeUrl;
    let profileImageUrl;

    if (req.files?.resume) {
      const resumeFile = req.files.resume[0];
      resumeUrl = `${req.protocol}://${req.get('host')}/${resumeFile.path?.replace(/\\/g, '/')}`;
    };

    if (req.files?.profileImage) {
      const profileImageFile = req.files.profileImage[0];
      profileImageUrl = `${req.protocol}://${req.get('host')}/${profileImageFile.path?.replace(/\\/g, '/')}`;
    };

    
    const profile = await createProfileService(userId, { ...profileData, resumeUrl, profileImageUrl });
    res.status(201).json({
      title: "Profile Created",
      profile,
      message: "Profile created successfully!",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userProfile = await getProfileService(userId);
    res.status(200).json({ title: "Your Profile", userProfile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;
    
    delete updatedData.id;
    delete updatedData.userId

    let resumeUrl;
    let profileImageUrl;

    if (req.files?.resume) {
      const resumeFile = req.files.resume[0];
      resumeUrl = `${req.protocol}://${req.get('host')}/${resumeFile.path?.replace(/\\/g, '/')}`;
    };

    if (req.files?.profileImage) {
      const profileImageFile = req.files.profileImage[0];
      profileImageUrl = `${req.protocol}://${req.get('host')}/${profileImageFile.path?.replace(/\\/g, '/')}`;
    };


    const profile = await updateProfileService(userId, { ...updatedData, resumeUrl, profileImageUrl });

    // Clear user cache to avoid stale data
    const pattern = `jobs:*:user:${profile.userId}*`;
    const keys = await cacheManager.getKeys(pattern);
      
    if (keys.length > 0) {
      for (const key of keys) {
        await cacheManager.delCache(key);
      };
      logger.info(`Cleared ${keys.length} cached entries for user ${profile.userId}`);
    } else {
      logger.info(`No cached jobs found for user ${profile.userId}`);
    }

    
    res.status(200).json({
      title: "Profile Updated",
      message: "Profile updated successfully!",
      profile,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    await deleteAccountService(userId);
    res.status(200).json({ sucess: true, message: "Account deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  };
};


