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


// Register
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array()[0].msg });

  const { name, email, password } = req.body;
  const otp = getOtp();
  const otpTime = getOtpExpiryTime(5);
  
  const token = await registerUser(name, email, password, otp, otpTime);
  
  if (!token) return res.status(400).send("email already exists");

  // Send otp email
  try {
    await emailService.sendOtp(email, "Your OTP Verification Code", name, otp, otpTime);
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
    await emailService.sendWelcomeEmail(recipient=user.email, username=user.name);
  } catch (error) {
    logger.error(error.message);
    throw AppError(error.nessage, 500);
  };

  // res.render("auth/login", { message: "Verification successful!" });
  res.status(200).send("Account verification was successful")
};


// Resend otp
export const resendOtp = async (req, res) => {
  const id = req.user.id;
  const otp = getOtp();
  const otpTime = getOtpExpiryTime(5);

  const user = await resendOtpService(id, otp, otpTime);
  if (!user) return res.status(401).send("Your not registered yet! Go to the sign up page!");

  // Send otp email
  try {
    await emailService.sendOtp(email, "Your OTP Verification Code", user.name, otp, otpTime);
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
  res.status(200).json({ message: "Login successful1"});
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
    const otpTime = getOtpExpiryTime();
    
    const user = await forgotPassword(email, otp, otpTime);
    
    if (!user) return res.status(400).send("Invalid credentials");
    await emailService.sendPasswordRecoveryEmail(recipient=user.email, username=user.name, otp=otp, otpTime=otpTime);
    
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
    const { email, password } = req.body;
    await resetPassword(email, otp, password);
    
    // res.render("auth/login", { message: "Password reset successful. Please log in." });
    res.status(201).json({message: "Password reset was successful."});

  } catch (error) {
    res.send(error.message);
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

