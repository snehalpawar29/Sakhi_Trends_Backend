import React from "react";
import { NavLink } from "react-router-dom";
import "../Layout/LayoutStyles/AdminMenu.css";
const AdminMenu = () => {
  return (
    <>
      <div className="text-center">
        <h4 className="Admin-Panel">ADMIN PANEL</h4>
        <div className=" Admin-menu">
          <NavLink
            to="/dashboard/admin/create-category"
            className="Admin-menu-item"
          >
            Create Category
          </NavLink>
          <NavLink
            to="/dashboard/admin/create-product"
            className="Admin-menu-item"
          >
            Create Product
          </NavLink>
          <NavLink to="/dashboard/admin/products" className="Admin-menu-item">
            Products
          </NavLink>
          <NavLink to="/dashboard/admin/orders" className="Admin-menu-item">
            Orders
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
