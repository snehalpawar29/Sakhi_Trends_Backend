import React from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
import "./styles/Categories.css";
const Categories = () => {
  const categories = useCategory();
  return (
    <Layout title={"All Categories"}>
      <div className="container" style={{ marginTop: "100px" }}>
        <div className="row">
          {categories.map((c) => (
            <div className="col-md-4 mt-5 mb-3" key={c._id}>
              <div className="card">
                {/* ==== ADDED CODE: Display Category Image ==== */}
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.name}
                    className="card-img-top"
                  />
                )}
                <div className="card-body text-center">
                  <Link to={`/category/${c.slug}`} className="btn cat-btn">
                    {c.name}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
