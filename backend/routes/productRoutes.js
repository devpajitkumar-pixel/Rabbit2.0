import express from "express";
import cache from "../middleware/cache.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createProduct,
  updatedProduct,
  deleteProduct,
  getProducts,
  getBestSeller,
  getNewArrivals,
  similarProducts,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

router.route("/").post(protect, admin, createProduct).get(getProducts);
router
  .route("/:id")
  .put(protect, admin, updatedProduct)
  .delete(protect, admin, deleteProduct);
router.get("/best-seller", cache("best-seller", 1800), getBestSeller);
router.get("/new-arrivals", cache("new-arrivals", 900), getNewArrivals);
router.get("/similar/:identifier", similarProducts);
router.get("/:identifier", getProductById);

export default router;
