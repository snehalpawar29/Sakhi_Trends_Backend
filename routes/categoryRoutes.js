import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  categoryControlller,
  createCategoryController,
  deleteCategoryController,
  singleCategoryController,
  updateCategoryController,
  getSubcategoriesByCategoryController,
} from "./../controllers/categoryController.js";

import multer from "multer";
import path from "path";

// ===== Multer Storage Setup =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to store uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name with timestamp
  },
});

const upload = multer({ storage });

const router = express.Router();

// ===== Routes =====

// Create a new category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  upload.single("image"),
  createCategoryController
);

// Update an existing category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  upload.single("image"),
  updateCategoryController
);

// Get all categories (flat list)
router.get("/get-category", categoryControlller);

// Get a single category by ID
router.get("/single-category/:id", singleCategoryController);

// Delete a category
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);

// New route to get subcategories for a category
router.get("/subcategories/:categoryId", getSubcategoriesByCategoryController);

export default router;
