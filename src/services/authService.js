import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import emailService from "./emailService.js";
import APP_CONFIG from "../config/APP_CONFIG.js";


// Register new user
export const registerUser = async (name, email, password, otp, otpTime) => {
  const exisingUser = await User.findOne({ where: { email } });
  if (exisingUser) return null;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed }, otp, otpTime);

  const token = jwt.sign({ id: user.id, email: user.email }, APP_CONFIG.JWT_OTP_SECRET, { expiresIn: APP_CONFIG.VERIFICATION_TOKEN_EXPIRY_TIME });

  return token;
};


// Verify user OTP
export const verifyUser = async (email, otp) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !user.otp || user.otp !== otp || !user.otpTime || user.otpTime < new Date()) return null;
  
  user.verified = true;
  user.otp = null;
  user.otptime = null;

  await user.save();

  return user;
};


// Resend otp - for resend cases
export const resendOtpService = async (id, otp, otpTime) => {
  const user = await User.findByPk( id );
  if (!user) return null;

  user.otp = otp;
  user.otpTime = otpTime;

  await user.save();

  return user;
};

// Login user and generate JWT
export const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) return null;
  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;
  const token = jwt.sign({ id: user.id, email: user.email }, APP_CONFIG.JWT_SECRET, { expiresIn: APP_CONFIG.ACCESS_TOKEN_EXPIRY_TIME });
  return token;
};

// Logout user (invalidate token client-side)
export const logoutUser = (res) => {
  res.clearCookie("token");
  return true;
};

// Forgot password — send OTP
export const forgotPassword = async (email, otp, otptime) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");
  
  user.otp = otp;
  user.otpTime = otptime;
  
  await user.save();

  return user;
};

// Reset password using OTP
export const resetPassword = async (email, otp, newPassword) => {
  const user = await User.findOne({ where: { email } });

  if (!user || !user.otp || user.otp !== otp || !user.otpTime || user.otpTime < new Date()) throw new Error("Invalid OTP");
  
  const hashed = await bcrypt.hash(newPassword, 10);
  
  user.password = hashed;
  user.otp = null;
  user.otpTime = null;

  await user.save();
  return user;
};

// Change password while logged in
export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Old password is incorrect");

  const hashedNew = await bcrypt.hash(newPassword, 10);
  user.password = hashedNew;
  await user.save();

  return { message: "Password changed successfully" };
};


