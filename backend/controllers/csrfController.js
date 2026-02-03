import { generateCsrfToken } from "../utils/csrf.js";
import dotenv from "dotenv";

dotenv.config();

export const issueCsrfToken = (req, res) => {
  const csrfToken = generateCsrfToken();

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("csrfToken", csrfToken, {
    httpOnly: false,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });

  res.status(200).json({ success: true });
};
