import React, { useEffect, useState } from "react";
import axios from "axios";

const CategoryTree = () => {
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState({}); // track expanded states

  useEffect(() => {
    const fetchTree = async () => {
      const { data } = await axios.get("/api/v1/category/category-tree");
      setCategories(data.tree || []);
    };
    fetchTree();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderCategories = (nodes) =>
    nodes.map((cat) => (
      <div key={cat._id} style={{ marginLeft: "20px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {cat.children?.length > 0 && (
            <button
              onClick={() => toggleExpand(cat._id)}
              style={{ marginRight: "5px" }}
            >
              {expanded[cat._id] ? "-" : "+"}
            </button>
          )}
          <span>{cat.name}</span>
        </div>

        {expanded[cat._id] &&
          cat.children?.length > 0 &&
          renderCategories(cat.children)}
      </div>
    ));

  return (
    <div>
      <h3>Category Hierarchy</h3>
      {renderCategories(categories)}
    </div>
  );
};

export default CategoryTree;
