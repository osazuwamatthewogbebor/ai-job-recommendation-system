import express from "express";
import { body } from "express-validator";
import {
  register,
  verify,
  login,
  logout,
  forgot,
  reset,
  changePasswordController,
  resendOtp
} from "../controllers/authControllers.js";
import { authMiddleware, verifyAccountMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();

// For frontend clicks and buttons to render auth pages
// router.get("/register", (req, res) => res.render("auth/register.ejs"));
// router.get("/login", (req, res) => res.render("auth/login"));
// router.get("/verify", (req, res) => res.render("auth/verify"));
// router.get("/forgot", (req, res) => res.render("auth/forgot"));
// router.get("/reset", (req, res) => res.render("auth/reset"));
// router.get("/change-password", authMiddleware ,(req, res) => res.render("auth/changePassword"));


// Actual post routes
router.post("/register",
  [
    body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 5 }).withMessage("Name must be at least 5 characters"),
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),
    body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
],
  register
);

router.post("/verify",
  [
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),
    body("otp")
    .notEmpty().withMessage("OTP is required")
    .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 characters"),
  ],
   verify
  );

router.post("/login",
   [
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),
    body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ], 
  login);

router.get("/send-otp", verifyAccountMiddleware, resendOtp);  
  
router.post("/forgot", 
  [
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),
  ],
  forgot
);

router.post("/reset", 
  [
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),
    body("otp")
    .notEmpty().withMessage("OTP is required")
    .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 characters"),
    body("newPassword")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  ],
  reset);

// logout
router.get("/logout", logout);


//  Change password route
router.post("/change-password", 
  authMiddleware, 
  [
    body("oldPassword")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("newPassword")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  ],
  changePasswordController);

export default router;
