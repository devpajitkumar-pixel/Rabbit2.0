import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import register from "../assets/register.webp";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../redux/slices/userApiSlice";
import { useMergeCartMutation } from "../redux/slices/cartApiSlice";
import { setCart } from "../redux/slices/cartSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [password, setPassword] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [mergeCart] = useMergeCartMutation();
  // Get redirect parameter and check if it is checkout or something
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Register FIRST
      const authResponse = await registerUser({
        name,
        email,
        password,
      }).unwrap();

      // 2️⃣ SAVE AUTH (token now available)
      dispatch(setCredentials(authResponse));

      // 3️⃣ MERGE CART (authenticated request)
      if (guestId && cart?.products?.length > 0) {
        const res = await mergeCart({ user, guestId }).unwrap();
        dispatch(setCart(res));
      }

      // 4️⃣ REDIRECT
      navigate(isCheckoutRedirect ? "/checkout" : "/");
    } catch (err) {
      console.error("Login / Merge failed", err);
    }
  };
  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">Rabbit</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Hay there!</h2>
          <p className="text-center mb-6">
            Enter your name, email and password to Register
          </p>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your email address"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            {isLoading ? "loading ..." : "Sign Up"}
          </button>
          <a
            href={`${import.meta.env.VITE_BACKEND_URL}/api/users/google?redirect=${encodeURIComponent(redirect)}`}
          >
            <div className="flex p-2 m-2 justify-center items-center border border-gray-300 rounded-lg font-semibold bg-gray-100 hover:bg-gray-200">
              <FcGoogle className="h-6 w-6" /> Continue with Google
            </div>
          </a>
          <p className="mt-6 text-center text-sm">
            I already have an account?{" "}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={register}
            alt="Register to Account"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
