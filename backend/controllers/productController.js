import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/product.js";
import mongoose from "mongoose";
import redisClient from "../config/redis.js";
import { isNavCacheable, buildNavCacheKey } from "../utils/cacheHelper.js";
import { cacheClear } from "../utils/cacheClear.js";

//@route POST /api/products
//@desc Create a new products
//@access Private/Admin

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    discountPrice,
    countInStock,
    sku,
    category,
    brand,
    sizes,
    colors,
    collections,
    material,
    gender,
    images,
    isFeatured,
    isPublished,
    tags,
    metaTitle,
    metaDescription,
    metaKeywords,
    dimensions,
    weight,
  } = req.body;
  const product = new Product({
    name,
    description,
    price,
    discountPrice,
    countInStock,
    sku,
    category,
    brand,
    sizes,
    colors,
    collections,
    material,
    gender,
    images,
    isFeatured,
    isPublished,
    tags,
    metaTitle,
    metaDescription,
    metaKeywords,
    dimensions,
    weight,
    user: req.user._id, //Reference to the admin user who created it
  });

  const createdProduct = await product.save();
  await cacheClear();
  res.status(201).json(createdProduct);
});

//@route PUT /api/products/:id
//@desc Update an existing product
//@access Private/Admin

const updatedProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    discountPrice,
    countInStock,
    sku,
    category,
    brand,
    sizes,
    colors,
    collections,
    material,
    gender,
    images,
    isFeatured,
    isPublished,
    tags,
    metaTitle,
    metaDescription,
    metaKeywords,
    dimensions,
    weight,
  } = req.body;
  //Find product by id
  const product = await Product.findById(req.params.id);

  if (product) {
    // Update only provided fields
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.discountPrice = discountPrice ?? product.discountPrice;
    product.countInStock = countInStock ?? product.countInStock;
    product.sku = sku ?? product.sku;
    product.category = category ?? product.category;
    product.brand = brand ?? product.brand;
    product.sizes = sizes ?? product.sizes;
    product.colors = colors ?? product.colors;
    product.collections = collections ?? product.collections;
    product.material = material ?? product.material;
    product.gender = gender ?? product.gender;
    product.images = images ?? product.images;
    product.isFeatured = isFeatured ?? product.isFeatured;
    product.isPublished = isPublished ?? product.isPublished;
    product.tags = tags ?? product.tags;
    product.metaTitle = metaTitle ?? product.metaTitle;
    product.metaDescription = metaDescription ?? product.metaDescription;
    product.metaKeywords = metaKeywords ?? product.metaKeywords;
    product.dimensions = dimensions ?? product.dimensions;
    product.weight = weight ?? product.weight;

    const updatedProduct = await product.save();
    await cacheClear();
    res.json(updatedProduct);
  } else {
    throw new Error("Product not found.");
    res.status(404).json({ message: "Product not found." });
  }
});

//@route DELETE /api/products/:id
//@desc Delete a product by ID
//@access Private/Admin

const deleteProduct = asyncHandler(async (req, res) => {
  //Find product by id
  const product = await Product.findById(req.params.id);

  if (product) {
    // Delete the product from database

    await product.deleteOne();
    await cacheClear();
    res.json({ message: "Product removed" });
  } else {
    throw new Error("Product not found.");
    res.status(404).json({ message: "Product not found." });
  }
});

//@route   GET /api/products
//@desc    Get all products with optional query filters + pagination
//@access  Public

const getProducts = asyncHandler(async (req, res) => {
  const {
    collection,
    size,
    color,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    material,
    brand,
    limit = 12,
    page = 1,
  } = req.query;
  const canCache = isNavCacheable(req.query);
  const cacheKey = canCache ? buildNavCacheKey(req.query) : null;
  if (cacheKey) {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
  }

  const query = {};

  // Filters
  if (collection && collection.toLowerCase() !== "all")
    query.collection = collection;

  if (gender) query.gender = gender;

  if (category && category.toLowerCase() !== "all") query.category = category;

  if (material) query.material = { $in: material.split(",") };
  if (brand) query.brand = { $in: brand.split(",") };
  if (size) query.sizes = { $in: size.split(",") };
  if (color) query.colors = { $in: color.split(",") };

  // Price
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Sorting
  let sort = {};
  if (sortBy === "priceAsc") sort = { price: 1 };
  if (sortBy === "priceDesc") sort = { price: -1 };
  if (sortBy === "popularity") sort = { rating: -1 };

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const totalProducts = await Product.countDocuments(query);

  const products = await Product.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  const response = {
    products,
    pagination: {
      totalProducts,
      currentPage: pageNum,
      totalPages: Math.ceil(totalProducts / limitNum),
      limit: limitNum,
    },
  };

  // 💾 Cache only nav pages
  if (cacheKey) {
    await redisClient.setEx(cacheKey, 900, JSON.stringify(response));
  }

  res.json(response);
});

//@route   GET /api/products/best-seller
//@desc    Retrive the product with hightest rating
//@access  Public

const getBestSeller = asyncHandler(async (req, res) => {
  const bestSeller = await Product.findOne().sort({ rating: -1 });
  if (bestSeller) {
    res.json(bestSeller);
  } else {
    throw new Error("No Best Seller Found.");
    res.status(404).json({ message: "No Best Seller Found." });
  }
});

//@route   GET /api/products/new-arrivals
//@desc    Retrive the latest 8 products
//@access  Public

const getNewArrivals = asyncHandler(async (req, res) => {
  const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
  if (newArrivals) {
    res.json(newArrivals);
  } else {
    throw new Error("No New Arrivals Found.");
    res.status(404).json({ message: "No New Arrivals Found." });
  }
});

//@route   GET /api/products/similar/:id
//@desc    Retrive similar products based on the current product's gender and category
//@access  Public

const similarProducts = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  const query = mongoose.Types.ObjectId.isValid(identifier)
    ? { _id: identifier }
    : { slug: identifier };

  const product = await Product.findOne(query);
  if (product) {
    const similarProducts = await Product.find({
      _id: { $ne: product._id },
      gender: product.gender,
      category: product.category,
    }).limit(4);
    res.json(similarProducts);
  } else {
    throw new Error("No Product Found.");
    res.status(404).json({ message: "Product not found" });
  }
});

//@route   GET /api/products/:id
//@desc    Get a single product by its ID
//@access  Public

const getProductById = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  const query = mongoose.Types.ObjectId.isValid(identifier)
    ? { _id: identifier }
    : { slug: identifier };

  const product = await Product.findOne(query);

  if (product) {
    res.json(product);
  } else {
    throw new Error("Product not found");
    res.status(404).json({ message: "Product not found" });
  }
});

export {
  createProduct,
  updatedProduct,
  deleteProduct,
  getProducts,
  getBestSeller,
  getNewArrivals,
  similarProducts,
  getProductById,
};
