import asyncHandler from "../middleware/asyncHandler.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import Checkout from "../models/checkout.js";
import Order from "../models/order.js";

//@route POST /api/checkout
//@desc Create a new checkout session
//@access Private

const createCheckout = asyncHandler(async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }
  //Create a new checkout session
  const newCheckout = await Checkout.create({
    user: req.user._id,
    checkoutItems: checkoutItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
    paymentStatus: "Pending",
    isPaid: false,
  });
  return res.status(201).json(newCheckout);
});

//@route PUT /api/checkout/:id/pay
//@desc Update checkout to mark as paid after successful payment
//@access Private

const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;
  const checkout = await Checkout.findById(req.params.id);

  if (!checkout) {
    return res.status(404).json({ message: "Checkout not found." });
  }

  if (paymentStatus === "paid") {
    checkout.isPaid = true;
    checkout.paymentStatus = paymentStatus;
    checkout.paymentDetails = paymentDetails;
    checkout.paidAt = Date.now();
    await checkout.save();

    return res.status(200).json(checkout);
  } else {
    throw new Error("Invalid Payment Status");
    return res.status(400).json({ message: "Invalid Payment status." });
  }
});

//@route POST /api/checkout/:id/finalize
//@desc Finalize checkout and convert to an order after payment confirmation
//@access Private

const creatFinalCheckoutWithOrder = asyncHandler(async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found." });
    }

    if (checkout.isPaid && !checkout.isFinalized) {
      //Create final order based on the checkout details

      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "paid",
        paymentDetails: checkout.paymentDetails,
      });

      // Mark the checkout as finalized
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();
      //Delete the cart associated with the user
      await Cart.findOneAndDelete({ user: checkout.user });
      return res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      return res.status(400).json({ message: "checkout already finalized." });
    } else {
      return res.status(400).json({ message: "checkout is not paid." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export { createCheckout, updatePaymentStatus, creatFinalCheckoutWithOrder };
