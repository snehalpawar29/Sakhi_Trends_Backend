import React from "react";
import { NavLink } from "react-router-dom";
import "./LayoutStyles/UserMenu.css";
const UserMenu = () => {
  return (
    <>
      <div className="text-center">
        {/* <h2 className="Dashboard">Dashboard</h2> */}
        {/* <hr className="horizon"/> */}
        <div className="list-group PO">
          <NavLink to="/dashboard/user/profile" className="Profile">
            Profile
          </NavLink>
          <NavLink to="/dashboard/user/orders" className="Orders">
            Orders
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default UserMenu;
