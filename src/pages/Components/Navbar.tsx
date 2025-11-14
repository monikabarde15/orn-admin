import React, { useState, useEffect } from "react";
import "../../pages/Components/Navbar.css";
import logoimg from "../../../public/assets/orllogo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt-auth");
    setIsLoggedIn(!!token);
  }, []);

  // 🔴 Logout function
  const handleLogout = () => {
    localStorage.removeItem("jwt-auth");

    // Clear all cookies
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });

    setIsLoggedIn(false);
    toast.info("You have been logged out!", { position: "top-center" });

    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  return (
    <>
      {/* ✅ Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      <nav className="navbar">
        {/* Logo */}
        <div className="navbar-logo">
          <span className="logo-icon">
            <img src={logoimg} alt="logo" width="200" height="100" />
          </span>
        </div>

        {/* Hamburger Toggle */}
        <div
          className={`navbar-toggle ${menuOpen ? "hidden" : ""}`}
          onClick={() => setMenuOpen(true)}
        >
          <div />
          <div />
          <div />
        </div>

        {/* Backdrop */}
        <div
          className={`menu-backdrop ${menuOpen ? "show" : ""}`}
          onClick={() => setMenuOpen(false)}
        ></div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <button className="close-btn" onClick={() => setMenuOpen(false)}>
            &times;
          </button>

          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="pricing">Pricing</a></li>
            <li><a href="process">Process</a></li>
            <li><a href="blog-all">Blogs</a></li>
            <li><a href="contact-us">Contact</a></li>
          </ul>

          {isLoggedIn ? (
            <button className="navbar-btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="navbar-btn">
              <a href="/login">Login</a> &nbsp;/&nbsp;
              <a href="/auth/boxed-signup">Signup</a>
            </button>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-actions">
          <ul className="navbar-links">
            <li><a href="/">Home</a></li>
            <li><a href="pricing">Pricing</a></li>
            <li><a href="process">Process</a></li>
            <li><a href="blog-all">Blogs</a></li>
            <li><a href="contact-us">Contact</a></li>
          </ul>

          {isLoggedIn ? (
            <button className="navbar-btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="navbar-btn">
              <a href="/login">Login</a> &nbsp;/&nbsp;
              <a href="/auth/boxed-signup">Signup</a>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
