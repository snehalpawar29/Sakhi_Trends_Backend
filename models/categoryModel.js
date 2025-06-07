import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // ✅ Ensure a category can't be created without a name
      unique: true, // ✅ Prevent duplicate category names
      trim: true, // ✅ Trim whitespace
    },
    slug: {
      type: String,
      lowercase: true,
      required: true, // ✅ Ensure slug is always present (important for URLs)
      unique: true, // ✅ Prevent duplicate slugs
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
