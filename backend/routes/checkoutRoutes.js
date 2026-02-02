import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createCheckout,
  updatePaymentStatus,
  creatFinalCheckoutWithOrder,
} from "../controllers/checkoutController.js";

const router = express.Router();

router.post("/", protect, createCheckout);
router.put("/:id/pay", protect, updatePaymentStatus);
router.post("/:id/finalize", protect, creatFinalCheckoutWithOrder);

export default router;
