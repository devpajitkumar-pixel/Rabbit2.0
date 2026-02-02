import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getAllOrders, getOrderById } from "../controllers/orderController.js";

const router = express.Router();

router.get("/my-orders", protect, getAllOrders);
router.get("/:id", protect, getOrderById);

export default router;
