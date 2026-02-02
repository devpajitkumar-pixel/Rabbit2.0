import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/order.js";

//@route GET /api/admin/orders
//@desc Get all products(Admin only)
//@access Private/Admin

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "name email");
  return res.json(orders);
});

//@route PUT /api/admin/orders/:id
//@desc Update order status(Admin only)
//@access Private/Admin

const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = req.body.status || order.status;
  order.isDelivered =
    req.body.status === "Delivered" ? true : order.isDelivered;
  order.deliveredAt =
    req.body.status === "Delivered" ? Date.now() : order.deliveredAt;

  const updatedOrder = await order.save();

  return res.status(200).json({
    message: "Order updated successfully",
    order: updatedOrder,
  });
});

//@route DELETE /api/admin/orders/:id
//@desc Remove an order (Admin only)
//@access Private/Admin

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "order not found" });
  }

  await order.deleteOne();

  return res.json({
    message: "order removed successfully",
  });
});

export { getAllOrders, updateOrder, deleteOrder };
