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

export const verifyUser = async (email, otp) => {
  const user = await User.findOne({ where: { email } });
  if (!user || user.otp !== otp) return null;
  if (!user || user.otp !== otp) throw new Error("Invalid OTP");
  user.verified = true;
  await user.save();
  return user;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Incorrect password");
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  return { user, token };
};
