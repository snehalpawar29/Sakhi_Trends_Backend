import React from "react";
import Header from "./Header.js";
import Footer from "./Footer.js";
import "../Layout/LayoutStyles/Layout.css";
import { Toaster } from "react-hot-toast";
export const Layout = ({ children }) => {
  return (
    <div className="bg">
      <Header />
      <main>
        <Toaster />
        {children}
      </main>
      <Footer />l
    </div>
  );
};

export default Layout;
