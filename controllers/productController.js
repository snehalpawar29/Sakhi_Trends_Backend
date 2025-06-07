import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import Product from "../models/productModel.js";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();
import formidable from "express-formidable";

// Payment gateway
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// CREATE PRODUCT
export const createProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subcategory,
      quantity,
      shipping,
    } = req.fields;
    const { mainPhoto, variantPhotos } = req.files;

    // Validation
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is Required" });
      case !description:
        return res.status(400).send({ error: "Description is Required" });
      case !price:
        return res.status(400).send({ error: "Price is Required" });
      case !category:
        return res.status(400).send({ error: "Category is Required" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is Required" });
      case mainPhoto && mainPhoto.size > 1000000:
        return res.status(400).send({ error: "Photo should be less than 1MB" });
    }

    // Validate subcategory ID format, if provided
    if (subcategory && !subcategory.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({ error: "Invalid subcategory ID format" });
    }

    const productData = {
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      slug: slugify(name),
    };

    // Only set subcategory if it is valid (non-empty and ObjectId-like)
    if (subcategory) {
      productData.subcategory = subcategory;
    }

    const product = new productModel(productData);

    // Save main photo
    if (mainPhoto) {
      product.photo.data = fs.readFileSync(mainPhoto.path);
      product.photo.contentType = mainPhoto.type;
    }

    // Save multiple variant photos
    if (variantPhotos) {
      const variantArray = Array.isArray(variantPhotos)
        ? variantPhotos
        : [variantPhotos]; // ensure it's always an array

      product.variantPhotos = variantArray.map((photo) => ({
        data: fs.readFileSync(photo.path),
        contentType: photo.type,
      }));
    }

    await product.save();

    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, error, message: "Error in creating product" });
  }
};

// Get Variant Photo by Index
export const productVariantPhotoController = async (req, res) => {
  try {
    const { pid, index } = req.params;
    const product = await productModel.findById(pid).select("variantPhotos");
    console.log("Fetched product variant photos:", product?.variantPhotos);

    const photo = product?.variantPhotos?.[index];
    if (photo?.data) {
      res.set("Content-Type", photo.contentType);
      return res.status(200).send(photo.data);
    } else {
      res.status(404).send({ message: "Variant photo not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error fetching variant photo", error });
  }
};

// GET ALL PRODUCTS
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .populate("subcategory")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error getting products", error });
  }
};

// GET SINGLE PRODUCT
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category")
      .populate("subcategory");

    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error getting single product", error });
  }
};

// GET PRODUCT PHOTO
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product?.photo?.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error getting photo", error });
  }
};

// DELETE PRODUCT
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res
      .status(200)
      .send({ success: true, message: "Product Deleted successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error deleting product", error });
  }
};

// UPDATE PRODUCT
export const updateProductController = async (req, res) => {
  try {
    const { pid } = req.params;
    const {
      name,
      description,
      price,
      quantity,
      category,
      subcategory,
      shipping,
    } = req.fields;
    const { mainPhoto, variantPhotos } = req.files || {};

    const product = await productModel.findById(pid);
    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "Product not found" });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.category = category || product.category;
    product.shipping = shipping || product.shipping;
    product.subcategory = subcategory || product.subcategory;

    // Update main photo if present
    if (mainPhoto) {
      product.photo.data = fs.readFileSync(mainPhoto.path);
      product.photo.contentType = mainPhoto.type;
    }

    // Update variant photos if present
    if (variantPhotos) {
      const variantArray = Array.isArray(variantPhotos)
        ? variantPhotos
        : [variantPhotos];

      product.variantPhotos = variantArray.map((photo) => ({
        data: fs.readFileSync(photo.path),
        contentType: photo.type,
      }));
    }

    await product.save();

    res.status(200).send({ success: true, product });
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .send({ success: false, message: "Error updating product", error });
  }
};

// FILTER PRODUCTS
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

// PRODUCT COUNT
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.estimatedDocumentCount();
    res.status(200).send({ success: true, total });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ success: false, message: "Error getting product count", error });
  }
};

// PAGINATED PRODUCT LIST
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page || 1;

    const products = await productModel
      .find({})
      .select("-photo")
      .populate("category")
      .populate("subcategory")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({ success: true, products });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ success: false, message: "Error in pagination", error });
  }
};

// SEARCH PRODUCTS
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo")
      .populate("category")
      .populate("subcategory");

    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: "Error in search", error });
  }
};

// RELATED PRODUCTS
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    const products = await productModel
      .find({ category: cid, _id: { $ne: pid } })
      .select("-photo")
      .limit(3)
      .populate("category")
      .populate("subcategory");

    res.status(200).send({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error getting related products",
      error,
    });
  }
};

// PRODUCTS BY CATEGORY
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel
      .find({ category })
      .populate("category")
      .populate("subcategory");

    res.status(200).send({ success: true, category, products });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error getting category products",
      error,
    });
  }
};

// BRAINTREE TOKEN
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) res.status(500).send(err);
      else res.send(response);
    });
  } catch (error) {
    console.log(error);
  }
};

// BRAINTREE PAYMENT
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = cart.reduce((acc, item) => acc + item.price, 0);

    gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: { submitForSettlement: true },
      },
      async function (error, result) {
        if (result) {
          await new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
