import express from "express";
import {
  brainTreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  productVariantPhotoController,
  realtedProductController,
  searchProductController,
  updateProductController,
} from "../controllers/productController.js";
import productModel from "../models/productModel.js"; // <--- IMPORTANT
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable({ multiples: true }),
  createProductController
);

//routes
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable({ multiples: true }),
  updateProductController
);

//get products
router.get("/get-product", getProductController);

//single product
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete rproduct
router.delete("/delete-product/:pid", deleteProductController);

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

// Get a specific variant photo by index
router.get("/product-variant-photo/:pid/:index", async (req, res) => {
  const { pid, index } = req.params;
  try {
    const product = await productModel.findById(pid).select("variantPhotos");
    if (
      product?.variantPhotos &&
      product.variantPhotos[index] &&
      product.variantPhotos[index].data
    ) {
      res.set("Content-Type", product.variantPhotos[index].contentType);
      return res.status(200).send(product.variantPhotos[index].data);
    } else {
      return res.status(404).send({ error: "Image not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error fetching variant image" });
  }
});

router.get("/product/variant-photo/:pid/:index", productVariantPhotoController);

export default router;
