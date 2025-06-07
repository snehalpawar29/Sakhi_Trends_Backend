import React from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import "../styles/AdminDashboard.css";
const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout>
      <div className="container-fluid main6">
        <div className="main6-subdiv1">
          <div className="AdminMenu1">
            <AdminMenu />
          </div>
          <div className="main6-subdiv2">
            <div className="main6-subdiv3">
              <h2>Admin Name: {auth?.user?.name} </h2>
              <h2>Admin Email: {auth?.user?.email} </h2>
              <h2>Admin Contact: {auth?.user?.phone} </h2>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
