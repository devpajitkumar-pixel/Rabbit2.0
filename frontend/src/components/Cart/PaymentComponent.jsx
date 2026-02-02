import React from "react";
import { useRazorpay } from "react-razorpay";
import { SiRazorpay } from "react-icons/si";
import axios from "axios";

const PaymentComponent = ({ amount, onSuccess, onError }) => {
  const { Razorpay, isLoading, error } = useRazorpay();
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrfToken="))
    ?.split("=")[1];

  const handlePayment = async () => {
    // 1️⃣ Get order from backend
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/create-razorpay-order`,
      { amount }, // body
      {
        withCredentials: true,
        headers: {
          "x-csrf-token": csrfToken,
        },
      },
    );

    const order = res.data;

    // 2️⃣ Open Razorpay
    const options = {
      key: import.meta.env.VITE_RZP_KEY, // ONLY key_id
      amount: order.amount,
      currency: order.currency,
      order_id: order.id, // ✅ REAL order_id
      name: "Rabbit",
      handler: function (response) {
        onSuccess(response);
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="
          flex items-center justify-center gap-3
          w-full max-w-sm
          rounded-xl
          bg-slate-900
          px-6 py-4
          text-white font-semibold text-base
          shadow-lg shadow-slate-900/30
          hover:bg-slate-800
          transition-all duration-300
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      >
        {/* Razorpay Icon */}
        <SiRazorpay />

        {isLoading ? "Processing..." : "Razorpay"}
      </button>

      <p className="text-xs text-slate-500 flex items-center gap-1">
        🔒 256-bit SSL Secure • Powered by Razorpay
      </p>

      <p className="text-[11px] text-slate-400">
        UPI • Cards • Net Banking • Wallets
      </p>
    </div>
  );
};

export default PaymentComponent;
