import express from "express";
import { issueCsrfToken } from "../controllers/csrfController.js";

const router = express.Router();

// GET /api/auth/csrf
router.get("/csrf", issueCsrfToken);

export default router;
