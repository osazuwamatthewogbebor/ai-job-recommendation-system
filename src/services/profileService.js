import Profile from "../models/Profile.js";
import User from "../models/User.js";


export const createProfileService = async (userId, data) => {
  const existing = await Profile.findOne({ where: { userId } });
  if (existing) throw new Error("Profile already exists.");

  const profile = await Profile.create({ ...data, userId });
  return profile;
};

export const getProfileService = async (userId) => {
  const profile = await Profile.findOne({ where: { userId } });
  if (!profile) throw new Error("Profile not found.");
  return profile;
};

export const updateProfileService = async (userId, data) => {
  const profile = await Profile.findOne({ where: { userId } });
  if (!profile) throw new Error("Profile not found.");

  await profile.update(data);
  return profile;
};

export const deleteAccountService = async (userId) => {
  await Profile.destroy({ where: { user_id: userId } });
  await User.destroy({ where: { id: userId } });
  return true;
};
