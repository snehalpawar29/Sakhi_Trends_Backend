import React from "react";
import Header from "./Header.js";
import Footer from "./Footer.js";
import "../Layout/LayoutStyles/Layout.css";
import { Toaster } from "react-hot-toast";

export const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Header />
      <main className="content">
        <Toaster />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
