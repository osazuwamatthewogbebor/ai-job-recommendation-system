import {
  registerUser,
  verifyUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  changePassword
} from "../services/authService.js";
import { validationResult } from "express-validator";
import emailService from "../services/emailService.js";
import logger from "../config/logger.js";
import AppError from "../utils/AppError.js";


// Register
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.render("auth/register", { errors: errors.array() });

  const { name, email, password } = req.body;
  const otp = await registerUser(name, email, password);

  // Send otp email
  try {
    await emailService.sendOtp(email, "Your OTP Verification Code", name, otp);
  } catch (error) {
    logger.error(error.message);
    throw new AppError(error.nessage, 500);
  };

  // res.render("auth/verify", { email });
  res.status(201).json({ message: "OTP sent to your email" });
};


// Verify OTP
export const verify = async (req, res) => {
  const { email, otp } = req.body;
  const user = await verifyUser(email, otp);
  if (!user) return res.status(400).send("Invalid OTP");

  // Send welcome email
  try {
    await emailService.sendWelcomeEmail(recipient=user.email, username=user.name);
  } catch (error) {
    logger.error(error.message);
    throw AppError(error.nessage, 500);
  };

  // res.render("auth/login", { message: "Verification successful!" });
  res.status(200).send("Account verification was successful")
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  const token = await loginUser(email, password);
  if (!token) return res.status(401).send("Invalid credentials");
  res.cookie("token", token);
  // res.redirect("/profile");
};

// Logout
export const logout = async (req, res) => {
  logoutUser(res);
  res.redirect("/auth/login");
};

// Forgot password
export const forgot = async (req, res) => {
  try {
    const { email } = req.body;
    await forgotPassword(email);
    
    await emailService.sendWelcomeEmail(recipient=user.email, username=user.name);
    // res.render("auth/reset", { email });
  
  } catch (error) {
    logger.error(error.message);
    res.send(error.message);
  }
};

// Reset password
export const reset = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    await resetPassword(email, otp, password);
    // res.render("auth/login", { message: "Password reset successful. Please log in." });
  } catch (error) {
    res.send(error.message);
  }
};

//  Change password (for logged-in user)
export const changePasswordController = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    await changePassword(userId, oldPassword, newPassword);
    // res.render("profile", { message: "Password changed successfully!" });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

