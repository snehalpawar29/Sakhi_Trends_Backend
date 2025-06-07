import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import CategoryForm from "../../components/Form/CategoryForm";
import "../styles/CreateCategory.css";
import { Modal } from "antd";

const CreateCategory = () => {
  // Category states
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  // Subcategory states
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState("");
  const [subName, setSubName] = useState("");

  // Edit modal states
  const [visible, setVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedImage, setUpdatedImage] = useState(null);

  const storedAuth = localStorage.getItem("auth");
  const token = storedAuth ? JSON.parse(storedAuth).token : null;

  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  // Fetch subcategories for a category
  const getSubcategories = async (categoryId) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    try {
      const { data } = await axios.get(
        `/api/v1/category/subcategories/${categoryId}`
      );
      if (data?.success) {
        setSubcategories(data.subcategories);
      }
    } catch (error) {
      toast.error("Failed to fetch subcategories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // When user selects a category to see/add subcategories
  useEffect(() => {
    getSubcategories(selectedCategoryForSub);
  }, [selectedCategoryForSub]);

  // Create Category
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("image", image);

      const { data } = await axios.post(
        "/api/v1/category/create-category",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(`${name} category created`);
        setName("");
        setImage(null);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error creating category");
    }
  };

  // Update Category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", updatedName);
      if (updatedImage) formData.append("image", updatedImage);

      const { data } = await axios.put(
        `/api/v1/category/update-category/${selectedCategory._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Category updated");
        setVisible(false);
        setSelectedCategory(null);
        setUpdatedName("");
        setUpdatedImage(null);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error updating category");
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/category/delete-category/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        toast.success("Category deleted");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error deleting category");
    }
  };

  // Open edit modal for category
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setUpdatedName(category.name);
    setUpdatedImage(null);
    setVisible(true);
  };

  // Create Subcategory
  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategoryForSub || !subName) {
      toast.error("Please select category and enter subcategory name");
      return;
    }
    try {
      const { data } = await axios.post(
        "/api/v1/subcategory/create-subcategory",
        { name: subName, category: selectedCategoryForSub },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Subcategory created");
        setSubName("");
        getSubcategories(selectedCategoryForSub);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error creating subcategory");
    }
  };

  // Delete Subcategory
  const handleDeleteSubcategory = async (id) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/subcategory/delete-subcategory/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        toast.success("Subcategory deleted");
        getSubcategories(selectedCategoryForSub);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error deleting subcategory");
    }
  };

  return (
    <Layout>
      <div className="container-fluid main7">
        <div className="row">
          <div className="col-md-3 main7-subdiv1">
            <AdminMenu />
          </div>
          <div className="col-md-9 main7-subdiv2">
            <h1>Manage Categories</h1>

            {/* Category Creation Form */}
            <div className="main7-subdiv3">
              <CategoryForm
                handleSubmit={handleCategorySubmit}
                value={name}
                setValue={setName}
                setImage={setImage}
              />
            </div>

            {/* Categories List */}
            <div className="main7-subdiv4">
              <h3>All Categories</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>
                        <button
                          className="btn btn-primary m-2"
                          onClick={() => openEditModal(c)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger m-2"
                          onClick={() => handleDeleteCategory(c._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Category Edit Modal */}
            <Modal
              onCancel={() => {
                setVisible(false);
                setUpdatedImage(null);
              }}
              footer={null}
              visible={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                setImage={setUpdatedImage}
                handleSubmit={handleUpdateCategory}
              />
            </Modal>

            <hr />

            {/* Subcategory Management */}
            <div>
              <h2>Manage Subcategories</h2>
              <div>
                <label>Select Category:</label>
                <select
                  value={selectedCategoryForSub}
                  onChange={(e) => setSelectedCategoryForSub(e.target.value)}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Add Form */}
              <form
                onSubmit={handleSubcategorySubmit}
                style={{ marginTop: "10px" }}
              >
                <input
                  type="text"
                  placeholder="Enter Subcategory Name"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                />
                <button type="submit" className="btn btn-success m-2">
                  Add Subcategory
                </button>
              </form>

              {/* Subcategory List */}
              <table className="table">
                <thead>
                  <tr>
                    <th>Subcategory Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subcategories.map((sub) => (
                    <tr key={sub._id}>
                      <td>{sub.name}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteSubcategory(sub._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {subcategories.length === 0 && (
                    <tr>
                      <td colSpan={2}>No subcategories found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
