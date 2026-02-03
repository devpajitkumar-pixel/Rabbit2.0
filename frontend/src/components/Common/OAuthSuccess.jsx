import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMergeCartMutation } from "../../redux/slices/cartApiSlice";
import { setCart } from "../../redux/slices/cartSlice";
import { setCredentials } from "../../redux/slices/authSlice";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./Loader";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const [mergeCart] = useMergeCartMutation();

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  const { csrfToken } = useSelector((state) => state.csrf);

  useEffect(() => {
    const fetchUserAndMergeCart = async () => {
      try {
        // 1️⃣ Fetch logged-in user (JWT already in cookie)
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
          {
            withCredentials: true,
            headers: {
              "x-csrf-token": csrfToken,
            },
          },
        );

        // 2️⃣ Save user in Redux + localStorage
        dispatch(
          setCredentials({
            user: {
              _id: res.data._id,
              name: res.data.name,
              email: res.data.email,
              role: res.data.role,
            },
          }),
        );

        // 3️⃣ Merge guest cart AFTER login
        if (guestId && cart?.products?.length > 0) {
          const mergedCart = await mergeCart({
            userId: res.data._id,
            guestId,
          }).unwrap();

          dispatch(setCart(mergedCart));
        }

        // 4️⃣ Redirect
        navigate(isCheckoutRedirect ? "/checkout" : "/", { replace: true });
      } catch (err) {
        console.error("OAuth login failed", err);
        navigate("/login", { replace: true });
      }
    };

    fetchUserAndMergeCart();
  }, []);

  return (
    <div>
      <Loader />
    </div>
  );
};

export default OAuthSuccess;
