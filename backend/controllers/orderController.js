import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/order.js";

//@route GET /api/orders/my-orders
//@desc Get logged-in user's order
//@access Private

const getAllOrders = asyncHandler(async (req, res) => {
  // Find orders for the authenticated user
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  }); //sort by the most recent orders

  return res.json(orders);
});

//@route GET /api/orders/:id
//@desc Get order details by ID
//@access Private

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }

  // Return the full order details

  return res.json(order);
});

export { getAllOrders, getOrderById };
