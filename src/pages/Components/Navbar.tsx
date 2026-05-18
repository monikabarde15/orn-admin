// src\pages\Components\Navbar.tsx (Vidya-merge)
import React, { useState, useEffect, useRef } from "react";
import "../../pages/Components/Navbar.css";
import "../../pages/Components/MegaMenu.css";
import logoimg from "../../../public/assets/logo.svg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User, LogOut, Wallet, Laptop, Lock, DollarSign } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [coursesMenuOpen, setCoursesMenuOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const navigate = useNavigate();
  const menuRef = useRef(null);

  const links = [
    { name: "Home", path: "/" },
    { name: "Courses", mega: true },
    { name: "About Us", path: "/about-us" },
    { name: "Blogs", path: "/blogs" },
    { name: "Contact Us", path: "/contact-us" },
  ];

  // Auto-detect login
  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out!");
    setTimeout(() => navigate("/"), 500);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileMenu(false);
        setCoursesMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const redirect = (path) => {
    setCoursesMenuOpen(false);
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <ToastContainer />

      <nav className="navbar">

        {/* ---------- LOGO ---------- */}
        <div className="navbar-logo">
          <img src={logoimg} alt="logo" className="logo-img" />
        </div>

        {/* ---------- MOBILE MENU BUTTON ---------- */}
        <div className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <div></div><div></div><div></div>
        </div>

        {/* ---------- MOBILE MENU ---------- */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <button className="close-btn" onClick={() => setMenuOpen(false)}>×</button>

          <ul className="mobile-links">

            {/* Loop menu items */}
            {links.map((item, i) => (
              <li key={i}>
                {item.mega ? (
                  <>
                    <span onClick={() => setCoursesMenuOpen(!coursesMenuOpen)}>
                      Courses ▾
                    </span>

                    {coursesMenuOpen && (
                      <ul className="mobile-submenu">
                        <li onClick={() => redirect("/cyber-security")}>Cyber Security</li>
                        <li onClick={() => redirect("/data-science-ai")}>Data Science & AI</li>
                        <li onClick={() => redirect("/advanced-programs")}>Advanced Programs</li>
                        <li onClick={() => redirect("/business-analytics")}>Business Analytics</li>
                        <li onClick={() => redirect("/technology-programs")}>Technology Programs</li>
                        <li onClick={() => redirect("/telecommunication")}>Telecommunication</li>
                        <li onClick={() => redirect("/science-programs")}>Science Programs</li>
                      </ul>
                    )}
                  </>
                ) : (
                  <a href={item.path}>{item.name}</a>
                )}
              </li>
            ))}
          </ul>

          {/* MOBILE PROFILE */}
          {isLoggedIn ? (
            <div className="mobile-profile">
              <div className="blue-btn">Profile</div>
              <p><Wallet size={16} /> ₹{walletBalance}</p>
              <button className="blue-btn" onClick={() => redirect("/wallet-history")}>Wallet History</button>
              <button className="blue-btn" onClick={() => redirect("/instances")}>Your Instances</button>
              <button className="red-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button className="navbar-btn mobile-login-btn">
              <a href="https://app.orn-ai.com/web/login">Login</a> / <a href="https://app.orn-ai.com/web/sign-up">Signup</a>
            </button>
          )}
        </div>

        {/* ---------- DESKTOP MENU ---------- */}
        <div className="navbar-actions">
          <ul className="navbar-links">

            {links.map((item, i) =>
              item.mega ? (
                <li key={i} className="mega-parent" onClick={() => setCoursesMenuOpen(!coursesMenuOpen)}>
                  <span className="menu-title">Courses ▾</span>

                  {coursesMenuOpen && (
                    <div className="mega-menu open">
                      <div className="mega-row">

                        <div className="mega-col" onClick={() => redirect("/cyber-security")}>
                          <h4>Cyber Security</h4>
                          <p>Learn to secure systems.</p>
                        </div>

                        <div className="mega-col" onClick={() => redirect("/data-science-ai")}>
                          <h4>Data Science & AI</h4>
                          <p>Master AI & ML.</p>
                        </div>

                        <div className="mega-col" onClick={() => redirect("/advanced-programs")}>
                          <h4>Advanced Programs</h4>
                          <p>DevOps & Cloud.</p>
                        </div>

                        <div className="mega-col" onClick={() => redirect("/business-analytics")}>
                          <h4>Business Analytics</h4>
                          <p>Data-driven insights.</p>
                        </div>

                        <div className="mega-col" onClick={() => redirect("/technology-programs")}>
                          <h4>Technology Programs</h4>
                          <p>Modern IT skills.</p>
                        </div>

                        <div className="mega-col" onClick={() => redirect("/telecommunication")}>
                          <h4>Telecommunication</h4>
                          <p>Network engineering.</p>
                        </div>

                        <div className="mega-col" onClick={() => redirect("/science-programs")}>
                          <h4>Science Programs</h4>
                          <p>Research & labs.</p>
                        </div>

                      </div>
                    </div>
                  )}
                </li>
              ) : (
                <li key={i}><a href={item.path}>{item.name}</a></li>
              )
            )}
          </ul>

          {/* ---------- PROFILE ---------- */}
          {isLoggedIn ? (
            <div className="profile-wrapper" ref={menuRef}>
              <div className="profile-avatar" onClick={() => setProfileMenu(!profileMenu)}>
                <User size={22} />
              </div>

              {profileMenu && (
                <div className="profile-dropdown clean-card">
                  <div onClick={() => redirect("/users/user-profile")}>My Profile</div>
                  <div><Wallet size={16} /> ₹{walletBalance}</div>
                  <div className="dropdown-item" onClick={() => redirect("/wallet-history")}>Wallet History</div>
                  <div className="dropdown-item" onClick={() => redirect("/your-instances")}>Your Instances</div>
                  <div className="dropdown-item" onClick={() => redirect("/change-password")}>Change Password</div>
                  <div className="dropdown-item" onClick={() => redirect("/apps/PaymentListNormal")}>My Payments</div>
                  <div className="dropdown-item logout" onClick={handleLogout}><LogOut size={16} /> Logout</div>
                </div>
              )}
            </div>
          ) : (
            <button className="navbar-btn"><a href="https://app.orn-ai.com/web/login">Login</a> / <a href="https://app.orn-ai.com/web/sign-up">Signup</a></button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
