import asyncHandler from "../middleware/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary Configuration

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  // Function to handle the stream upload to Cloudinary
  const streamUpload = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "products",
          resource_type: "image",
          timeout: 120000,
          transformation: [
            { width: 1200, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        },
      );
      // Use streamifier to convert file buffer to a stream
      streamifier.createReadStream(fileBuffer).pipe(stream);
    });
  };
  // call the streamUpload function
  const result = await streamUpload(req.file.buffer);
  // Respond with the uploaded image url

  return res.json({ imageUrl: result.secure_url });
});

export { uploadImage };
