import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/uploadController.js";

// Multer setup using memory storage

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/", upload.single("image"), uploadImage);

export default router;
