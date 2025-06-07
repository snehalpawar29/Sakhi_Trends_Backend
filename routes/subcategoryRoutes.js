// routes/subcategoryRoutes.js
import express from "express";
import {
  createSubcategoryController,
  deleteSubcategoryController,
  getSubcategoriesByCategoryController, // ✅ Add this line
} from "../controllers/subcategoryController.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post(
  "/create-subcategory",
  requireSignIn,
  isAdmin,
  createSubcategoryController
);
router.delete(
  "/delete-subcategory/:id",
  requireSignIn,
  isAdmin,
  deleteSubcategoryController
);

// In routes/subcategoryRoutes.js
router.get(
  "/get-subcategories/:categoryId",
  getSubcategoriesByCategoryController
);

export default router;
