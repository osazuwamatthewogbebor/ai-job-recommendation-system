import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// Register new user
export const registerUser = async (name, email, password) => {
  const hashed = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const user = await User.create({ name, email, password: hashed, otp });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Verification Code",
    text: `Verify your account, Your OTP is ${otp}`
  });

  return user;
};

// Verify user OTP
export const verifyUser = async (email, otp) => {
  const user = await User.findOne({ where: { email } });
  if (!user || user.otp !== otp) return null;
  user.verified = true;
  user.otp = null;
  await user.save();
  return user;
};

// Login user and generate JWT
export const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) return null;
  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  return token;
};

// Logout user (invalidate token client-side)
export const logoutUser = (res) => {
  res.clearCookie("token");
  return true;
};

// Forgot password — send OTP
export const forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  await user.save();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Use this OTP to reset your password: ${otp}`
  });

  return otp;
};

// Reset password using OTP
export const resetPassword = async (email, otp, newPassword) => {
  const user = await User.findOne({ where: { email } });
  if (!user || user.otp !== otp) throw new Error("Invalid OTP");
  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.otp = null;
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

