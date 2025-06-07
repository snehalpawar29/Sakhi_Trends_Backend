import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import axios from "axios";
import "../styles/Orders.css";
import moment from "moment";
import { useAuth } from "../../context/auth";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth(); // Don't need setAuth here

  // Function to fetch latest orders
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders", {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      setOrders(data);
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getOrders();

      // Auto-refresh orders every 10 seconds (adjust as needed)
      const interval = setInterval(getOrders, 10000);

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [auth?.token]);

  return (
    <Layout>
      <div className="container-fluid main2">
        <div className="row main2-subdiv">
          <div className="col-md-3 main2-subdiv-div1">
            <h2 className="Dashboard2">Dashboard</h2>
            <div className="head-main-orders">
              <UserMenu />
            </div>
            <h1 className="head">All Orders</h1>
          </div>
          <div className="col-md-9 main2-subdiv-div2">
            <br />
            <br />
            {orders?.map((o, i) => (
              <div className="border shadow main3" key={o._id}>
                <table className="table main3-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Status</th>
                      <th>Buyer</th>
                      <th>Date</th>
                      <th>Payment</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <td>{o?.status}</td>{" "}
                      {/* Status should update automatically */}
                      <td>{o?.buyer?.name}</td>
                      <td>{moment(o?.createdAt).fromNow()}</td>
                      <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                      <td>{o?.products?.length}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="container main4">
                  {o?.products?.map((p) => (
                    <div
                      className="row mb-2 p-3 card flex-row main4-subdiv"
                      key={p._id}
                    >
                      <div className="col-md-4 main4-subdiv-div1">
                        <img
                          src={`/api/v1/product/product-photo/${p._id}`}
                          className="card-img-top1"
                          alt={p.name}
                        />
                      </div>
                      <div className="col-md-8">
                        <p className="prd-n">
                          Name: {p?.name || "No Name Available"}
                        </p>
                        <p className="prd-d">
                          Description:{" "}
                          {p?.description || "No Description Available"}
                        </p>
                        <p className="prd-p">
                          Price: Rs. {p?.price !== undefined ? p.price : "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
