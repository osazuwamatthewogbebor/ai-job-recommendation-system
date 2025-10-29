import {
  registerUser,
  verifyUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  changePassword,
  resendOtpService
} from "../services/authService.js";
import { validationResult } from "express-validator";
import emailService from "../services/emailService.js";
import logger from "../config/logger.js";
import AppError from "../utils/AppError.js";
import { getOtp, getOtpExpiryTime } from "../utils/otpGen.js";
import APP_CONFIG from "../config/APP_CONFIG.js";


// Register
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array()[0].msg });

  const { name, email, password } = req.body;
  const otp = getOtp();
  const otpTimeMins = APP_CONFIG.OTP_EXPIRY_TIME_MINS;
  const otpTime = getOtpExpiryTime(otpTimeMins);
  
  const token = await registerUser(name, email, password, otp, otpTime);
  
  if (!token) return res.status(400).send("Invalid credentials");

  // Send otp email
  try {
    await emailService.sendOtp(email, "Your OTP Verification Code", name, otp, otpTimeMins);
  } catch (error) {
    logger.error(error.message);
    throw new AppError(error.nessage, 500);
  };

  res.cookie("token", token);
  // res.render("auth/verify", { email });
  res.status(201).json({ message: "OTP sent to your email" });
};


// Verify OTP
export const verify = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array()[0].msg });

  const { email, otp } = req.body;
  const user = await verifyUser(email, otp);
  if (!user) return res.status(400).send("Invalid OTP");

  // Send welcome email
  try {
    await emailService.sendWelcomeEmail(user.email, 'Welcome to Smart AI Jobber!', user.name);
  } catch (error) {
    logger.error(error.message);
    throw new AppError(error.nessage, 500);
  };

  res.clearCookie("token");
  // res.render("auth/login", { message: "Verification successful!" });
  res.status(200).send("Account verification was successful")
};


// Resend otp
export const resendOtp = async (req, res) => {
  const id = req.user.id;
  const otp = getOtp();
  const otpTimeMins = APP_CONFIG.OTP_EXPIRY_TIME_MINS;
  const otpTime = getOtpExpiryTime(otpTimeMins);

  const user = await resendOtpService(id, otp, otpTime);
  if (!user) return res.status(401).send("You are not registered yet! Go to the sign up page!");

  // Send otp email
  try {
    await emailService.sendOtp(user.email, "Your OTP Verification Code", user.name, otp, otpTimeMins);
  } catch (error) {
    logger.error(error.message);
    throw new AppError(error.nessage, 500);
  };

   res.status(201).json({ message: "OTP sent to your email" });
};


// Login
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array()[0].msg });

  const { email, password } = req.body;
  const token = await loginUser(email, password);
  if (!token) return res.status(401).send("Invalid credentials");
  
  res.cookie("token", token);
  res.status(200).json({ message: "Login successful"});
};


// Logout
export const logout = async (req, res) => {
  logoutUser(res);
  // res.redirect("/auth/login");
  res.status(200).json({message: "Log out successful."});
};


// Forgot password
export const forgot = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array()[0].msg });

  try {
    const { email } = req.body;
    const otp = getOtp();
    const otpTimeMins = APP_CONFIG.OTP_EXPIRY_TIME_MINS;
    const otpTime = getOtpExpiryTime(otpTimeMins);
    
    const user = await forgotPassword(email, otp, otpTime);
    
    if (!user) return res.status(400).send("Invalid credentials");
    await emailService.sendPasswordRecoveryEmail(user.email, 'Password Reset Request', user.name, otp, otpTimeMins);
    
    res.status(200).json({ message: "Password reset email has been sent to your inbox."});

  } catch (error) {
    logger.error(error.message);
    res.send(error.message);
  }
};


// Reset password
export const reset = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array()[0].msg });

  try {
    const { email, otp, newPassword } = req.body;
    await resetPassword(email, otp, newPassword);
    
    // res.render("auth/login", { message: "Password reset successful. Please log in." });
    res.status(201).json({message: "Password reset was successful."});

  } catch (error) {
    res.status(400).send(error.message);
  }
};


//  Change password (for logged-in user)
export const changePasswordController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array()[0].msg });

  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    await changePassword(userId, oldPassword, newPassword);
    
    // res.render("profile", { message: "Password changed successfully!" });
    res.status(201).json({ message: "Password change was successful."});
  } catch (error) {
    res.status(400).send(error.message);
  }
};

