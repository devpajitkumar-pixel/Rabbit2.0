import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/adminOrderController.js";

const router = express.Router();

router.get("/", protect, admin, getAllOrders);
router.put("/:id", protect, admin, updateOrder);
router.delete("/:id", protect, admin, deleteOrder);

export default router;
