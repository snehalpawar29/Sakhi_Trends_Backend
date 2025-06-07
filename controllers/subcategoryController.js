import Subcategory from "../models/subcategoryModel.js";
import slugify from "slugify";

// Create a new Subcategory
export const createSubcategoryController = async (req, res) => {
  try {
    const { name, category } = req.body; // category = parent category ID

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and category ID are required",
      });
    }

    // Check if subcategory with same name exists under the same category
    const existingSubcategory = await Subcategory.findOne({ name, category });
    if (existingSubcategory) {
      return res.status(400).json({
        success: false,
        message: "Subcategory already exists under this category",
      });
    }

    const subcategory = new Subcategory({
      name,
      slug: slugify(name),
      category,
    });

    await subcategory.save();

    res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      subcategory,
    });
  } catch (error) {
    console.error("Create Subcategory Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating subcategory",
      error,
    });
  }
};

// Update a subcategory by ID
export const updateSubcategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and category ID are required",
      });
    }

    // Check for duplicates when updating
    const duplicate = await Subcategory.findOne({
      name,
      category,
      _id: { $ne: id },
    });
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message:
          "Another subcategory with this name already exists in the category",
      });
    }

    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      id,
      { name, slug: slugify(name), category },
      { new: true }
    );

    if (!updatedSubcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subcategory updated successfully",
      subcategory: updatedSubcategory,
    });
  } catch (error) {
    console.error("Update Subcategory Error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating subcategory",
      error,
    });
  }
};

// Delete a subcategory by ID
export const deleteSubcategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Subcategory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subcategory deleted successfully",
    });
  } catch (error) {
    console.error("Delete Subcategory Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting subcategory",
      error,
    });
  }
};

// Get all subcategories
export const getAllSubcategoriesController = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({}).populate(
      "category",
      "name slug"
    );
    res.status(200).json({
      success: true,
      message: "All subcategories fetched successfully",
      subcategories,
    });
  } catch (error) {
    console.error("Get All Subcategories Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching subcategories",
      error,
    });
  }
};

// Get subcategories by category ID
export const getSubcategoriesByCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.params;
    console.log("Fetching subcategories for category:", categoryId);

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    const subcategories = await Subcategory.find({ category: categoryId });
    console.log("Found subcategories:", subcategories.length);

    res.status(200).json({
      success: true,
      message: "Subcategories fetched successfully",
      subcategories,
    });
  } catch (error) {
    console.error("Get Subcategories By Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching subcategories by category",
      error,
    });
  }
};

// Get single subcategory by ID
export const getSingleSubcategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    const subcategory = await Subcategory.findById(id).populate(
      "category",
      "name slug"
    );

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subcategory fetched successfully",
      subcategory,
    });
  } catch (error) {
    console.error("Get Single Subcategory Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching subcategory",
      error,
    });
  }
};
