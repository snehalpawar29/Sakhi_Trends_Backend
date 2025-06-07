import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import "../styles/AdminOrders.css";
import { Select } from "antd";
const { Option } = Select;

const AdminOrders = () => {
  //eslint-disable-next-line
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "deliverd",
    "cancel",
  ]);
  //eslint-disable-next-line
  const [changeStatus, setChangeStatus] = useState("");
  const [orders, setOrders] = useState([]);
  //eslint-disable-next-line
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      // NEW: Include Authorization header with admin token
      const { data } = await axios.get("/api/v1/auth/all-orders", {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      // Adjust response handling as needed
      if (data?.orders) {
        setOrders(data.orders);
      } else {
        setOrders(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(
        `/api/v1/auth/order-status/${orderId}`,
        { status: value },
        {
          headers: { Authorization: `Bearer ${auth?.token}` }, // Ensure token is sent
        }
      );

      // ✅ Update orders state immediately to reflect change without refresh
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: value } : order
        )
      );
    } catch (error) {
      console.log("Error updating order status:", error);
    }
  };

  return (
    <Layout>
      <div className="row main11">
        <div className="col-md-3 main11-subdiv1">
          <AdminMenu />
        </div>
        <div className="col-md-9 main11-subdiv2">
          {orders?.map((o, i) => {
            return (
              <div className="border shadow main11-subdiv4" key={o._id}>
                <table className="table main11-subdiv5">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Status</th>
                      <th scope="col">Buyer</th>
                      <th scope="col">Date</th>
                      <th scope="col">Payment</th>
                      <th scope="col">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <td>
                        <Select
                          onChange={(value) => handleChange(o._id, value)}
                          defaultValue={o?.status}
                        >
                          {status.map((s, i) => (
                            <Option key={i} value={s}>
                              {s}
                            </Option>
                          ))}
                        </Select>
                      </td>
                      <td>{o?.buyer?.name}</td>
                      <td>{moment(o?.createdAt || o?.createAt).fromNow()}</td>
                      <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                      <td>{o?.products?.length}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="container main11-subdiv6">
                  {o?.products?.map((p) => (
                    <div
                      className="row mb-2 p-3 card flex-row main11-subdiv7"
                      key={p._id}
                    >
                      <div className="col-md-4">
                        <img
                          src={`/api/v1/product/product-photo/${p._id}`}
                          className="card-img-top2 main11-subdiv8"
                          alt={p.name}
                        />
                      </div>
                      <div className="col-md-8 main11-subdiv9">
                        <p>{p.name}</p>
                        <p>{p.description}</p>
                        <p>Price : {p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
