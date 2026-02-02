import { generateCsrfToken } from "../utils/csrf.js";

export const issueCsrfToken = (req, res) => {
  const csrfToken = generateCsrfToken();

  res.cookie("csrfToken", csrfToken, {
    httpOnly: false, // frontend must read
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  res.status(200).json({ success: true });
};
