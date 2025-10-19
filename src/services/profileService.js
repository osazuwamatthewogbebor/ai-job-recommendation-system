import User from "../models/User.js";

export const updateProfile = async (userId, profileData, resumeFile) => {
  const { skills, experience, field } = profileData;
  const updateData = { skills, experience, field };
  if (resumeFile) updateData.resume = resumeFile.filename;

  const [updated] = await User.update(updateData, { where: { id: userId } });
  if (!updated) throw new Error("User not found");
  return await User.findByPk(userId);
};
