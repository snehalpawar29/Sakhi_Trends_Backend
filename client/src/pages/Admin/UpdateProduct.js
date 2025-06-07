import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState(null); // main product photo
  const [id, setId] = useState("");
  const [variantCount, setVariantCount] = useState(0); // number of variant images

  // New: Track changed variant photo files by index
  const [variantPhotosFiles, setVariantPhotosFiles] = useState({});

  // Fetch single product and set states
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      const p = data?.product;

      setName(p.name);
      setDescription(p.description);
      setPrice(p.price);
      setCategory(p.category._id);
      setQuantity(p.quantity);
      setShipping(p.shipping ? "1" : "0");
      setId(p._id);

      if (p.variantPhotos) {
        setVariantCount(p.variantPhotos.length);
      } else {
        setVariantCount(0);
      }

      if (p.category._id) {
        const { data: subData } = await axios.get(
          `/api/v1/subcategory/get-subcategories/${p.category._id}`
        );
        if (subData?.success) {
          setSubcategories(subData.subcategories);
          setSubcategory(p.subcategory?._id || "");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load product");
    }
  };

  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting categories");
    }
  };

  useEffect(() => {
    getSingleProduct();
    getAllCategory();
  }, []);

  useEffect(() => {
    if (!category) {
      setSubcategories([]);
      setSubcategory("");
      return;
    }

    const fetchSubcategories = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/subcategory/get-subcategories/${category}`,
          { headers: { "Cache-Control": "no-cache" } }
        );
        if (data?.success) {
          setSubcategories(data.subcategories);
        }
      } catch (error) {
        console.error("Error fetching subcategories", error);
        setSubcategories([]);
        toast.error("Failed to load subcategories");
      }
    };

    fetchSubcategories();
  }, [category]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("category", category);
      if (subcategory && subcategory.trim() !== "") {
        productData.append("subcategory", subcategory);
      }

      productData.append("shipping", shipping);
      if (photo) productData.append("photo", photo);

      // Append variant photos files with index keys
      Object.entries(variantPhotosFiles).forEach(([index, file]) => {
        productData.append(`variantPhotos[${index}]`, file);
      });

      const { data } = await axios.put(
        `/api/v1/product/update-product/${id}`,
        productData
      );

      if (data?.success) {
        toast.success("Product Updated Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Update failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.prompt(
        "Are you sure you want to delete this product? Type YES to confirm"
      );
      if (answer !== "YES") return;
      await axios.delete(`/api/v1/product/delete-product/${id}`);
      toast.success("Product Deleted Successfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Update Product"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Product</h1>
            <div className="m-1 w-75">
              {/* Category */}
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setCategory(value);
                  setSubcategory("");
                }}
                value={category || undefined}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              {/* Subcategory */}
              <Select
                bordered={false}
                placeholder="Select a subcategory"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => setSubcategory(value)}
                value={subcategory || undefined}
                disabled={!category}
              >
                {subcategories?.map((sc) => (
                  <Option key={sc._id} value={sc._id}>
                    {sc.name}
                  </Option>
                ))}
              </Select>

              {/* Upload Main Photo */}
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>

              {/* Preview Main Photo */}
              <div className="mb-3 text-center">
                <img
                  src={
                    photo
                      ? URL.createObjectURL(photo)
                      : id
                      ? `/api/v1/product/product-photo/${id}`
                      : ""
                  }
                  alt="product_photo"
                  height={"200px"}
                  className="img img-responsive"
                />
              </div>

              {/* Variant Images Preview with Change option */}
              <div className="mb-3">
                <h5>Variant Images</h5>
                <div className="d-flex flex-wrap gap-3 align-items-center">
                  {Array.from({ length: variantCount }).map((_, idx) => (
                    <div key={idx} style={{ textAlign: "center" }}>
                      <img
                        src={
                          variantPhotosFiles[idx]
                            ? URL.createObjectURL(variantPhotosFiles[idx])
                            : `/api/v1/product/product-variant-photo/${id}/${idx}`
                        }
                        alt={`Variant ${idx + 1}`}
                        height="100px"
                        style={{
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          display: "block",
                          marginBottom: "5px",
                        }}
                      />
                      <label className="btn btn-outline-secondary btn-sm">
                        Change
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setVariantPhotosFiles((prev) => ({
                                ...prev,
                                [idx]: file,
                              }));
                            }
                          }}
                        />
                      </label>
                    </div>
                  ))}
                  {variantCount === 0 && <p>No variant images available.</p>}
                </div>
              </div>

              {/* Name */}
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
                  placeholder="Write a price"
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
                  placeholder="Select shipping"
                  size="large"
                  className="form-select mb-3"
                  onChange={(value) => setShipping(value)}
                  value={shipping || "0"}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>

              {/* Buttons */}
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleUpdate}>
                  UPDATE PRODUCT
                </button>
              </div>
              <div className="mb-3">
                <button className="btn btn-danger" onClick={handleDelete}>
                  DELETE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
