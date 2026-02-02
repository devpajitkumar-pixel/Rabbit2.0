import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";
import { useGetOrderDetailsQuery } from "../redux/slices/orderApiSlice";
import Error from "../components/Common/Error";
import Loader from "../components/Common/Loader";

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const {
    data: order,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(id, {
    skip: !id,
  });

  // Clear cart only AFTER successful order fetch
  useEffect(() => {
    if (order?._id) {
      dispatch(clearCart());
    }
  }, [order, dispatch]);

  useEffect(() => {
    if (error) {
      navigate("/my-orders");
    }
  }, [error, navigate]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (error)
    return (
      <div>
        <Error error={error} />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You for Your Order!
      </h1>
      {order && (
        <div className="p-6 rounded-lg border">
          <div className="flex justify-between mb-20">
            {/* Order Id & Date */}
            <div>
              <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
              <p className="text-gray-500">
                Order Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            {/* Estimated Delivery */}
            <div>
              <p className="text-emerald-700 text-sm">
                Estimated Delivery:{""}
                {calculateEstimatedDelivery(order.createdAt)}
              </p>
            </div>
          </div>
          {/* Order Items */}
          <div className="mb-20">
            {order.orderItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-start justify-between py-2 border-b"
              >
                <div className="flex items-start">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover mr-4"
                  />
                  <div className="">
                    <h3 className="text-md">{item.name}</h3>
                    <p className="text-gray-500">Size:{item.size}</p>
                    <p className="text-gray-500">Color:{item.color}</p>
                    <p className="text-gray-500">Qantity: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-xl">${item.price?.toLocaleString()}</p>
              </div>
            ))}
          </div>
          {/* Payment and Delivery Info */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-2">Payment</h4>
              <p className="text-gray-600">Razorpay</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Delivery</h4>
              <p className="text-gray-600">{order.shippingAddress.address}</p>
              <p className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
