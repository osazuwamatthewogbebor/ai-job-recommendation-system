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
    const resume = req.file ? req.file.path : null;

    const profile = await createProfileService(userId, { ...profileData, resume });
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
    const resume = req.file ? req.file.path : undefined;

    const profile = await updateProfileService(userId, { ...updatedData, resume });

    // Clear user cache to avoid stale data
    const keys = await cacheManager.redis.keys(`jobs:*:user:${profile.user_id}*`);
    for (const key of keys) await cacheManager.delCache(key);
    
    res.status(200).json({
      title: "Profile Updated",
      profile,
      message: "Profile updated successfully!",
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


