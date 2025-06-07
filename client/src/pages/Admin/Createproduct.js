import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import "../styles/Createproduct.css";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [mainPhoto, setMainPhoto] = useState(null);
  const [variantPhotos, setVariantPhotos] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState(""); // New state for subcategory
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  // Get subcategories when category changes
  const getSubcategories = async (categoryId) => {
    try {
      const { data } = await axios.get(
        `/api/v1/category/subcategories/${categoryId}`
      );
      if (data?.success) {
        setSubcategories(data?.subcategories);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch subcategories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // When category changes, fetch subcategories and reset selected subcategory
  useEffect(() => {
    if (category) {
      getSubcategories(category);
      setSubcategory(""); // reset selected subcategory
    } else {
      setSubcategories([]);
      setSubcategory("");
    }
  }, [category]);

  // Create product function
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("mainPhoto", mainPhoto);
      variantPhotos.forEach((photo) => {
        productData.append("variantPhotos", photo);
      });
      productData.append("category", category);
      productData.append("subcategory", subcategory);
      productData.append("shipping", shipping);

      const token = JSON.parse(localStorage.getItem("auth"))?.token;
      if (!token) {
        toast.error("You must be logged in to create a product.");
        return;
      }

      const { data } = await axios.post(
        "/api/v1/product/create-product",
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data?.success) {
        toast.success("Product Created Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Create product error:", error);
      toast.error("Something went wrong");
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const { data } = await axios.get(
        `/api/v1/category/subcategory/${categoryId}`
      );
      if (data?.success) {
        setSubcategories(data.subcategories);
      }
    } catch (error) {
      console.error("Failed to fetch subcategories", error);
    }
  };

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3 am">
            <AdminMenu />
          </div>
          <div className="col-md-9 main8">
            <h1>Create Product</h1>
            <div className="m-1 w-75">
              {/* Category Select */}
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setCategory(value);
                  fetchSubcategories(value);
                }}
                value={category || undefined}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              {/* Subcategory Select */}
              {subcategories.length > 0 && (
                <Select
                  bordered={false}
                  placeholder="Select a subcategory"
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => setSubcategory(value)}
                  value={subcategory || undefined}
                >
                  {subcategories.map((sc) => (
                    <Option key={sc._id} value={sc._id}>
                      {sc.name}
                    </Option>
                  ))}
                </Select>
              )}

              {/* Main Photo Upload */}
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {mainPhoto ? mainPhoto.name : "Upload Main Image"}
                  <input
                    type="file"
                    name="mainPhoto"
                    accept="image/*"
                    onChange={(e) => setMainPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>

              {mainPhoto && (
                <div className="text-center mb-3">
                  <img
                    src={URL.createObjectURL(mainPhoto)}
                    alt="main"
                    height={"200px"}
                    className="img img-responsive"
                  />
                </div>
              )}

              {/* Variant Photos Upload */}
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  Upload Variant Images
                  <input
                    type="file"
                    name="variantPhotos"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      setVariantPhotos(Array.from(e.target.files))
                    }
                    hidden
                  />
                </label>
              </div>

              {/* Preview Variant Images */}
              {variantPhotos.length > 0 && (
                <div className="mb-3 d-flex gap-2 flex-wrap">
                  {variantPhotos.map((photo, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(photo)}
                      alt={`variant-${index}`}
                      height="100px"
                      className="img "
                    />
                  ))}
                </div>
              )}

              {/* Product Name */}
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="Write a name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <textarea
                  type="text"
                  value={description}
                  placeholder="Write a description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Price */}
              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="Write a Price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* Quantity */}
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="Write a quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              {/* Shipping */}
              <div className="mb-3">
                <Select
                  bordered={false}
                  placeholder="Select Shipping"
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => setShipping(value)}
                  value={shipping || undefined}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>

              {/* Submit Button */}
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleCreate}>
                  CREATE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
