import express from "express";
import {
  createProfile,
  getProfile,
  updateProfile,
  deleteAccount,
} from "../controllers/profileControllers.js";
import upload from "../middleware/multerSetup.js";

const router = express.Router();

// Routes
router.get("/", getProfile);
router.post("/create", upload.single("resume"), createProfile);
router.post("/update", upload.single("resume"), updateProfile);
router.post("/delete", deleteAccount);


export default router;

