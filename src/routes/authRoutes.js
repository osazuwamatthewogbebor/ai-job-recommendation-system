import express from "express";
import { body } from "express-validator";
import { register, verify, login } from "../controllers/authController.js";

const router = express.Router();

router.get("/register", (req, res) => res.render("auth/register"));
router.get("/login", (req, res) => res.render("auth/login"));
router.get("/verify", (req, res) => res.render("auth/verify"));

router.post("/register",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password too short"),
],
  register
);
router.post("/verify", verify);
router.post("/login", login);

export default router;
