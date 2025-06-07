import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    category: {
      // ✅ use lowercase
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

// Add an index on the category field for faster queries
// subCategorySchema.index({ category: 1 });

// Prevent model overwrite error in dev environments
const Subcategory =
  mongoose.models.Subcategory ||
  mongoose.model("Subcategory", subCategorySchema);

export default Subcategory;
