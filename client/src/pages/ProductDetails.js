import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../context/auth";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";
import { useParams, useNavigate } from "react-router-dom";
import "../pages/styles/ProductDetails.css";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [mainImgIndex, setMainImgIndex] = useState(null); // for switching variant images
  const [auth] = useAuth();
  const [cart, setCart] = useCart([]);
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h1 className="text-center main13-subdiv4">PRODUCT DETAILS</h1>
      <div className="main13">
        <div className="col-md-6 main13-subdiv1">
          <img
            src={
              mainImgIndex !== null && product.variantPhotos?.length
                ? `/api/v1/product/product-variant-photo/${product._id}/${mainImgIndex}`
                : `/api/v1/product/product-photo/${product._id}`
            }
            className="card-img-top3 main13-subdiv2"
            alt={product.name}
          />

          {/* Variant thumbnails */}
          {product.variantPhotos && product.variantPhotos.length > 0 && (
            <div
              className="d-flex mt-3"
              style={{ overflowX: "auto", paddingLeft: "8px" }}
            >
              {product.variantPhotos.map((_, index) => (
                <img
                  key={index}
                  src={`/api/v1/product/product-variant-photo/${product._id}/${index}`}
                  alt={`Variant ${index + 1}`}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    marginRight: "8px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    border:
                      mainImgIndex === index
                        ? "2px solid #007bff"
                        : "1px solid #ccc",
                  }}
                  onClick={() => setMainImgIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="col-md-6 main13-subdiv3">
          <h4>
            <strong>Name: </strong>
            {product?.name}
          </h4>
          <h4>
            <strong>Description: </strong>
            {product?.description}
          </h4>
          <h4>
            <strong>Price: Rs. </strong>
            {product?.price}
          </h4>
          <h4>
            <strong>Category: </strong>
            {product?.category?.name}
          </h4>
          <h4>
            <strong>Subcategory: </strong>
            {product?.subcategory?.name}
          </h4>
        </div>
      </div>

      {/* Related Products */}
      <div className="row main13-subdiv5">
        <h1 className="text-center">
          <br />
          <strong>You will also Like!</strong>
        </h1>
        <hr />
        <div className="d-flex flex-wrap main13-subdiv6">
          {relatedProducts?.map((p) => (
            <div
              key={p._id}
              className="card m-2 main13-subdiv7"
              style={{ width: "18rem" }}
            >
              <img
                src={`/api/v1/product/product-photo/${p._id}`}
                alt={p.name}
                className="card-img-top main13-subdiv8"
              />
              <div className="card-body main13-subdiv9">
                <h5 className="card-title main13-subdiv10">{p.name}</h5>
                <p className="card-text">{p.description}</p>
                <p className="card-text">Rs.{p.price}</p>
                <button
                  className="btn btn-secondary ms-1"
                  onClick={() => {
                    if (!auth?.token) {
                      navigate("/login");
                      toast.error(
                        "You must be logged in to add items to the cart"
                      );
                      return;
                    }
                    setCart([...cart, p]);
                    localStorage.setItem("cart", JSON.stringify([...cart, p]));
                    toast.success("Item Added To Cart");
                  }}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
