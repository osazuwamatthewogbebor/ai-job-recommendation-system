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
router.post("/create", 
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]), 
  createProfile
);

router.get("/", getProfile);

router.post("/update", 
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]), 
  updateProfile
);

router.delete("/delete", deleteAccount);


export default router;

