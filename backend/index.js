import express from "express";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import cors from "cors";
import connectDB from "./config/db.js";
import csrfRoutes from "./routes/csrfRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productAdminRoutes from "./routes/productAdminRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import { emailQueue } from "./queues/emailQueue.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/passport.js";
import redisClient from "./config/redis.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { csrfProtect } from "./middleware/csrfMiddleware.js";
import emailRoutes from "./routes/emailRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use(
  cors({
    // origin: "https://rabbit-dczz.vercel.app",
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-csrf-token"],
  }),
);
app.use((req, res, next) => {
  req.redis = redisClient;
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to Rabbit Server.");
});
app.use("/api/email", emailRoutes);
app.use("/api/auth", csrfRoutes);

//API Routes
app.use("/api/users", csrfProtect, userRoutes);
app.use("/api/products", csrfProtect, productRoutes);
app.use("/api/cart", csrfProtect, cartRoutes);
app.use("/api/checkout", csrfProtect, checkoutRoutes);
app.use("/api/orders", csrfProtect, orderRoutes);
app.use("/api/upload", csrfProtect, uploadRoutes);
app.use("/api/subscribe", csrfProtect, subscriberRoutes);

//Admin
app.use("/api/admin/users", csrfProtect, adminRoutes);
app.use("/api/admin/products", csrfProtect, productAdminRoutes);
app.use("/api/admin/orders", csrfProtect, adminOrderRoutes);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/api/create-razorpay-order", csrfProtect, async (req, res) => {
  const { amount } = req.body;

  const order = await razorpay.orders.create({
    amount: amount * 100, // paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  res.json(order);
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV;

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT} in ${MODE} mode.`),
);
