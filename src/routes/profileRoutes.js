import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { update } from "../controllers/profileController.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.get("/", authMiddleware, (req, res) => res.render("profile"));
router.post("/update", authMiddleware, upload.single("resume"), update);

export default router;
