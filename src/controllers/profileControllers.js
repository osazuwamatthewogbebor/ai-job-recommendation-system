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
    const resumeUrl = `${req.protocol}://${req.get('host')}/${req.file?.path?.replace(/\\/g, '/')}`;
    
    const profile = await createProfileService(userId, { ...profileData, resumeUrl });
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
    const profile = await getProfileService(userId);
    res.status(200).json({ title: "Your Profile", profile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;
    const resumeUrl = `${req.protocol}://${req.get('host')}/${req.file?.path?.replace(/\\/g, '/')}`;
    
    delete updatedData.id;
    delete updatedData.userId

    const profile = await updateProfileService(userId, { ...updatedData, resumeUrl });

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


