import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import "../styles/Dashboard.css";
const Dashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout>
      <div className="container-fluid main1">
        <div className="row main1-subdiv">
          <div className="col-md-3">
            <h2 className="Dashboard1">Dashboard</h2>
            <div className="um1">
              <UserMenu />
            </div>
          </div>

          <div className="card details">
            <h3 className="h31">Registered Name : {auth?.user?.name}</h3>
            <h3 className="h32">Registered Email : {auth?.user?.email}</h3>
            <h3 className="h33">Registered Address : {auth?.user?.address}</h3>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
