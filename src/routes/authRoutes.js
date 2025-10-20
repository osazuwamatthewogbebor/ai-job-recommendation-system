import express from "express";
import { body } from "express-validator";
import {
  register,
  verify,
  login,
  logout,
  forgot,
  reset,
  changePasswordController
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/register", (req, res) => res.render("auth/register"));
router.get("/login", (req, res) => res.render("auth/login"));
router.get("/verify", (req, res) => res.render("auth/verify"));
router.get("/forgot", (req, res) => res.render("auth/forgot"));
router.get("/reset", (req, res) => res.render("auth/reset"));
router.get("/change-password", (req, res) => res.render("auth/changePassword"));

router.post("/register",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password too short"),
],
  register
);
router.post("/verify", verify);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgot", forgot);
router.post("/reset", reset);

//  Change password route
router.post("/change-password", authMiddleware, changePasswordController);

export default router;
