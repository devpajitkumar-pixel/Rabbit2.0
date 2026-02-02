import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/product.js";

//@route GET /api/admin/products
//@desc Get all products(Admin only)
//@access Private/Admin

const getAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  return res.json(products);
});

export { getAdminProducts };
