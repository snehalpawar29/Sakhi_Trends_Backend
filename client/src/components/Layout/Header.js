import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import { useCart } from "../../context/cart";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { FaBicycle } from "react-icons/fa6";
import "../Layout/LayoutStyles/Header.css";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div className="container-fluid container-fluid1">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <Link to="/" className="navbar-brand d-flex align-items-center">
          <FaBicycle size={40} color="white" />
          <span className="ms-2">Spinning Wheels</span>
        </Link>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item me-3">
              <SearchInput />
            </li>

            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </li>

            <li className="nav-item dropdown">
              {auth?.user ? (
                <>
                  <Link
                    to="/categories"
                    className="nav-link dropdown-toggle"
                    id="categoriesDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Categories
                  </Link>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="categoriesDropdown"
                  >
                    <li>
                      <Link to="/categories" className="dropdown-item">
                        All Categories
                      </Link>
                    </li>
                    {categories?.map((c) => (
                      <li key={c._id}>
                        <Link
                          to={`/category/${c.slug}`}
                          className="dropdown-item"
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <NavLink to="/login" className="nav-link">
                  Categories
                </NavLink>
              )}
            </li>

            {!auth?.user ? (
              <>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <NavLink
                  className="nav-link dropdown-toggle"
                  role="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ border: "none" }}
                >
                  {auth.user.name}
                </NavLink>
                <ul className="dropdown-menu" aria-labelledby="userDropdown">
                  <li>
                    <NavLink
                      to={`/dashboard/${
                        auth.user.role === 1 ? "admin" : "user"
                      }`}
                      className="dropdown-item"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={handleLogout}
                      to="/login"
                      className="dropdown-item"
                    >
                      Logout
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}

            <li className="nav-item position-relative">
              <NavLink to="/cart" className="nav-link">
                Cart
                <span className="cart">{cart?.length}</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
