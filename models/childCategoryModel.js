import mongoose from "mongoose";

const childCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory", // make sure you have this model too
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChildCategory", childCategorySchema);
