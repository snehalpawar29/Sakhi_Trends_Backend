import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "./styles/HomePage.css";

const ProductCard = ({ product, cart, setCart }) => {
  const navigate = useNavigate();
  const [mainImgIndex, setMainImgIndex] = useState(null);

  return (
    <div className="card m-2" style={{ width: "18rem" }}>
      <img
        src={
          mainImgIndex !== null &&
          product.variantPhotos &&
          product.variantPhotos[mainImgIndex]
            ? `/api/v1/product/product-variant-photo/${product._id}/${mainImgIndex}`
            : `/api/v1/product/product-photo/${product._id}`
        }
        className="card-img-top"
        alt={product.name}
        style={{ height: "200px", objectFit: "cover" }}
      />

      {/* Variant images thumbnails */}
      <div
        className="variant-images d-flex mt-2 px-2"
        style={{ overflowX: "auto" }}
      >
        {product.variantPhotos && product.variantPhotos.length > 0 ? (
          product.variantPhotos.map((photo, index) => (
            <img
              key={index}
              src={`/api/v1/product/product-variant-photo/${product._id}/${index}`}
              alt={`${product.name} variant ${index + 1}`}
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                marginRight: "8px",
                cursor: "pointer",
                borderRadius: "4px",
                border:
                  mainImgIndex === index
                    ? "2px solid #007bff"
                    : "1px solid #ddd",
              }}
              onClick={() => setMainImgIndex(index)}
            />
          ))
        ) : (
          <p>No variant images</p>
        )}
      </div>

      <div className="card-body">
        <div className="card-name-price d-flex justify-content-between align-items-center">
          <h5 className="card-title">{product.name}</h5>
          <h5 className="card-title card-price">
            {product.price.toLocaleString("en-US", {
              style: "currency",
              currency: "INR",
            })}
          </h5>
        </div>
        <p className="card-text">{product.description.substring(0, 60)}...</p>
        <div className="card-name-price">
          <button
            className="btn btn-info ms-1"
            onClick={() => navigate(`/product/${product.slug}`)}
          >
            More Details
          </button>
          <button
            className="btn btn-dark ms-1"
            onClick={() => {
              setCart([...cart, product]);
              localStorage.setItem("cart", JSON.stringify([...cart, product]));
              toast.success("Item Added to cart");
            }}
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [subcategoriesMap, setSubcategoriesMap] = useState({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState([]);

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Get total product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  // Get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Load more products
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Fetch subcategories when a category is selected
  const handleFilter = async (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
      // Fetch subcategories
      try {
        const { data } = await axios.get(
          `/api/v1/subcategory/get-subcategories/${id}`
        );
        if (data?.success) {
          setSubcategoriesMap((prev) => ({
            ...prev,
            [id]: data.subcategories,
          }));
        }
      } catch (err) {
        console.error("Error fetching subcategories", err);
      }
    } else {
      all = all.filter((c) => c !== id);
      // Remove subcategories for deselected category
      const updatedMap = { ...subcategoriesMap };
      delete updatedMap[id];
      setSubcategoriesMap(updatedMap);
    }
    setChecked(all);
  };

  // Filter products
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  const toggleCategory = async (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );

    // If not already fetched, get subcategories
    if (!subcategoriesMap[categoryId]) {
      try {
        const { data } = await axios.get(
          `/api/v1/subcategory/get-subcategories/${categoryId}`
        );
        if (data?.success) {
          setSubcategoriesMap((prev) => ({
            ...prev,
            [categoryId]: data.subcategories,
          }));
        }
      } catch (err) {
        console.error("Error fetching subcategories", err);
      }
    }
  };

  return (
    <Layout title={"All Products - Best offers"}>
      {/* banner image */}
      <img
        src="/images/banner.png"
        className="banner-img"
        alt="banner"
        width={"100%"}
      />
      {/* main content */}
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-3 filters">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <div key={c._id} className="mb-2">
                <div
                  onClick={() => toggleCategory(c._id)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      marginRight: "8px",
                      width: "20px",
                      textAlign: "center",
                    }}
                  >
                    {expandedCategories.includes(c._id) ? "−" : "+"}
                  </span>
                  <Checkbox
                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                    checked={checked.includes(c._id)}
                    onClick={(e) => e.stopPropagation()} // prevent toggleCategory
                  >
                    {c.name}
                  </Checkbox>
                </div>
                {/* Subcategories shown when expanded */}
                {expandedCategories.includes(c._id) &&
                  subcategoriesMap[c._id]?.length > 0 && (
                    <div className="ms-4 mt-1">
                      {subcategoriesMap[c._id].map((sub) => (
                        <div key={sub._id}>
                          <Checkbox disabled>{sub.name}</Checkbox>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>

          {/* price filter */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>

          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>

        {/* product display */}
        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                cart={cart}
                setCart={setCart}
              />
            ))}
          </div>

          {/* Load more button */}
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  "Loading ..."
                ) : (
                  <>
                    Load More <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
