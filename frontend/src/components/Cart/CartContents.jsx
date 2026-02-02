import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  useUpdateCartItemQuantityMutation,
  useRemoveFromCartMutation,
} from "../../redux/slices/cartApiSlice";
import { setCart } from "../../redux/slices/cartSlice";
const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();
  const [updateCartItemQuantity] = useUpdateCartItemQuantityMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  // Handle adding or substracting to cart

  const handleAddToCart = async (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      const res = await updateCartItemQuantity({
        productId,
        quantity: newQuantity,
        guestId,
        userId,
        size,
        color,
      }).unwrap();
      dispatch(setCart(res));
    }
  };

  const handleRemoveFromCart = async (productId, size, color) => {
    const res = await removeFromCart({
      productId,
      guestId,
      userId,
      size,
      color,
    }).unwrap();
    dispatch(setCart(res));
  };

  return (
    <div>
      {cart.products.map((product, index) => (
        <div
          key={index}
          className="flex items-start justify-between py-4 border-b"
        >
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover mr-4 rounded"
            />
            <div>
              <h3>{product.name}</h3>
              <p className="text-sm text-gray-500">
                size: {product.size} | {product.color}
              </p>
              <div className="flex items-center mt-2">
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      -1,
                      product.quantity,
                      product.size,
                      product.color,
                    )
                  }
                  type="button"
                  className="border rounded px-2 text-xl font-medium"
                >
                  -
                </button>
                <span className="mx-4">{product.quantity}</span>
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      1,
                      product.quantity,
                      product.size,
                      product.color,
                    )
                  }
                  type="button"
                  className="border rounded px-2 text-xl font-medium"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div>
            <p>$ {(product.price * product.quantity).toFixed(2)}</p>
            <button
              onClick={() =>
                handleRemoveFromCart(
                  product.productId,
                  product.size,
                  product.color,
                )
              }
              type="button"
            >
              <RiDeleteBin3Line className="w-6 h-6 mt-3 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
