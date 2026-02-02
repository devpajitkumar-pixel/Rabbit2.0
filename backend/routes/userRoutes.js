import express from "express";
import passport from "passport";
import { protect } from "../middleware/authMiddleware.js";
import {
  loginUser,
  registerUser,
  getUserProfile,
  userLogout,
  initiateGoogle,
  googleCallback,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.post("/logout", protect, userLogout);

// Start Google login
router.get("/google", initiateGoogle);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  googleCallback,
);

export default router;
