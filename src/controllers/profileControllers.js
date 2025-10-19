import { validationResult } from "express-validator";
import * as profileService from "../services/profileService.js";

export const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const userId = req.user.id;
    const updatedUser = await profileService.updateProfile(userId, req.body, req.file);
    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
   res.redirect("/jobs");
};

