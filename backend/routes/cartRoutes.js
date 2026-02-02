import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import {
  createCart,
  updateCart,
  deleteCart,
  getAllCart,
  mergeCart,
} from "../controllers/cartController.js";

const router = express.Router();

router
  .route("/")
  .get(getAllCart)
  .post(createCart)
  .put(updateCart)
  .delete(deleteCart);
router.post("/merge", protect, mergeCart);

export default router;
