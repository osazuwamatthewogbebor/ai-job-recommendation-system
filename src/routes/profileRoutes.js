import express from "express";
import multer from "multer";
// import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createProfile,
  getProfile,
  updateProfile,
  deleteAccount,
} from "../controllers/profileControllers.js";


const router = express.Router();

// Configure multer for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
// router.get("/", authMiddleware, getProfile);
// router.post("/create", authMiddleware, upload.single("resume"), createProfile);
// router.post("/update", authMiddleware, upload.single("resume"), updateProfile);
// router.post("/delete", authMiddleware, deleteAccount);

export default router;

