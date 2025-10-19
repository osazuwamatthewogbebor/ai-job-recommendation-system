import { validationResult } from "express-validator";
import * as authService from "../services/authService.js";

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.render("auth/register", { errors: errors.array() });

  const { name, email, password } = req.body;
  await authService.registerUser(name, email, password);
  res.render("auth/verify", { email });
  res.status(201).json({ message: "OTP sent to your email" });
};

export const verify = async (req, res) => {
  const { email, otp } = req.body;
  const user = await authService.verifyUser(email, otp);
  if (!user) return res.send("Invalid OTP");
  res.render("auth/login", { message: "Verification successful!" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const token = await authService.loginUser(email, password);
  if (!token) return res.send("Invalid credentials");
  res.cookie("token", token);
  res.json({ message: "Login successful", token, user });
  res.redirect("/profile");
};
