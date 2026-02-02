import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { getAdminProducts } from "../controllers/productAdminController.js";

const router = express.Router();

router.get("/", protect, admin, getAdminProducts);

export default router;
