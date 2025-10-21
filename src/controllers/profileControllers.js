import {
  createProfileService,
  getProfileService,
  updateProfileService,
  deleteAccountService,
} from "../services/profileService.js";

export const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;
    const resume = req.file ? req.file.path : null;

    const profile = await createProfileService(userId, { ...profileData, resume });
    res.render("profile/profile", {
      title: "Profile Created",
      profile,
      message: "Profile created successfully!",
    });
  } catch (error) {
    res.status(400).render("profile/profile", { error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getProfileService(userId);
    res.render("profile/profile", { title: "Your Profile", profile });
  } catch (error) {
    res.status(400).render("profile/profile", { error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;
    const resume = req.file ? req.file.path : undefined;

    const profile = await updateProfileService(userId, { ...updatedData, resume });
    res.render("profile/profile", {
      title: "Profile Updated",
      profile,
      message: "Profile updated successfully!",
    });
  } catch (error) {
    res.status(400).render("profile/profile", { error: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    await deleteAccountService(userId);
    res.redirect("/auth/logout");
  } catch (error) {
    res.status(400).send(error.message);
  }
  res.status(201).json({ message: "Account deleted successfully" });
};


