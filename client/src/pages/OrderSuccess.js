import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/styles/OrderSuccess.css";

const OrderSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the user's orders page after 5 seconds
    const timer = setTimeout(() => {
      navigate("/dashboard/user/orders");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="order-success-page"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h1>Order Successful!</h1>
      <p>Your order has been placed successfully.</p>
      <p>You will be redirected to your orders page shortly.</p>
    </div>
  );
};

export default OrderSuccess;
