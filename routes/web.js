import express from "express";
const router = express.Router();

import {
  registerUser,
  registerUserpost,
  verifyUser,
  loginUser
} from "../Controllers/AuthController.js";

import { UserProfile } from "../Controllers/ProfileController.js";

import isAuth from "../middleware/isAuth.js";

import {
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct
} from "../Controllers/ProductController.js";

import {
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory
} from "../Controllers/CategoryController.js";

import upload from "../middleware/upload.js"; // multer middleware

// Categories routes
router.get("/categories/:id", isAuth, getCategory);
router.post("/categories", isAuth, addCategory);
router.put("/categories/:id", isAuth, updateCategory);
router.delete("/categories/:id", isAuth, deleteCategory);

// Products routes
router.get("/products/:id", isAuth, getProduct);
// For adding product with image upload:
router.post("/products", isAuth, upload.single("image"), addProduct);
// For updating product with optional image upload:
router.put("/products/:id", isAuth, upload.single("image"), updateProduct);
router.delete("/products/:id", isAuth, deleteProduct);

// User auth routes
router.post("/user/register", registerUser);
router.get("/user/register", registerUserpost);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);
router.get("/user/profile", isAuth, UserProfile);

export default router;
