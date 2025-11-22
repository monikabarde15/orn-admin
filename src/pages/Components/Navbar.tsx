import React, { useState, useEffect, useRef } from "react";
import "../../pages/Components/Navbar.css";
import logoimg from "../../../public/assets/orllogo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Wallet, User, LogOut, Laptop, ShoppingCart, Lock, DollarSign } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem("orl_cart") || "[]"));
  const [cartOpen, setCartOpen] = useState(false);

  const menuRef = useRef(null);
  const cartRef = useRef(null);
  const API_BASE = "https://backend.onrequestlab.com/api/v1";

  useEffect(() => {
    const token = localStorage.getItem("jwt-auth");
    setIsLoggedIn(!!token);
    if (token) fetchWalletBalance(token);
  }, []);

  const fetchWalletBalance = async (token) => {
    setLoadingWallet(true);
    try {
      const res = await axios.get(`${API_BASE}/users/wallet/balance/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWalletBalance(res.data?.balance ?? res.data?.wallet_amount ?? 0);
    } catch (err) {
      console.error("Wallet fetch error:", err);
      setWalletBalance(0);
    } finally {
      setLoadingWallet(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setProfileMenu(false);
      if (cartRef.current && !cartRef.current.contains(e.target)) setCartOpen(false);
    };
    const handleStorageChange = () => setCartItems(JSON.parse(localStorage.getItem("orl_cart") || "[]"));

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt-auth");
    toast.info("You have been logged out!", { position: "top-center" });
    setTimeout(() => (window.location.href = "/"), 800);
  };

  const navigateTo = (path) => (window.location.href = path);

  const links = isLoggedIn
    ? ["/", "/about-us", "/labs", "/process", "/blogs","/contact-us"]
    : ["/", "/about-us", "/labs", "/process", "/blogs", "/contact-us"];

  return (
    <>
      <ToastContainer position="top-center" autoClose={1500} theme="colored" />

      <nav className="navbar">
        {/* Logo */}
        <div className="navbar-logo">
          <span className="logo-icon">
            <img src={logoimg} alt="logo" width="200" height="100" />
          </span>
        </div>

        {/* Hamburger */}
        <div className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        {/* Mobile menu backdrop */}
        <div className={`menu-backdrop ${menuOpen ? "show" : ""}`} onClick={() => setMenuOpen(false)} />

        {/* Mobile Menu */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <button className="close-btn" onClick={() => setMenuOpen(false)}>×</button>

          <ul className="mobile-links">
            {links.map((path, i) => (
              <li key={i}>
                <a href={path}>
                  {path === "/" ? "Home" : path.split("/")[1].replace("-", " ").toUpperCase()}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Cart */}
          <div className="mobile-cart-box">
            <div className="mobile-cart-icon" onClick={() => setCartOpen(!cartOpen)}>
              <ShoppingCart size={22} />
              {cartItems.length > 0 && <span className="cart-count-mobile">{cartItems.length}</span>}
              <span style={{ marginLeft: "6px" }}>Cart</span>
            </div>
            {cartOpen && (
              <div className="cart-dropdown-mobile">
                {cartItems.length === 0 ? <p>No items added</p> : cartItems.map((item, idx) => (
                  <div key={idx} className="cart-item-row">
                    <span>{item.name}</span>
                    <strong> ₹ {item.monthlyPrice ?? item.yearlyPrice ?? item.price ?? 0}</strong>
                  </div>
                ))}
                <div className="cart-total-row">
                  <span className="cart-total-label">Total</span>
                  <div className="vertical-line"></div>
                  <strong className="cart-total-amount">
                    ₹ {cartItems.reduce((total, item) => {
                      return total + (item.monthlyPrice ?? item.yearlyPrice ?? item.price ?? 0);
                    }, 0).toFixed(2)}
                  </strong>
                </div>

                <button className="blue-btn w-full" onClick={() => navigateTo("/cart")}>Go to Cart</button>
              </div>
            )}
          </div>

          {/* Mobile Profile */}
          {isLoggedIn ? (
            <div className="mobile-profile">
              <p className="wallet-line">
                <Wallet size={16} /> {loadingWallet ? "Loading..." : `₹${walletBalance}`}
              </p>
              <button className="blue-btn" onClick={() => navigateTo("/wallet-history")}>Wallet History</button>
              <button className="blue-btn" onClick={() => navigateTo("/instances")}>Your Instances</button>
              <button className="red-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button className="navbar-btn mobile-login-btn">
              <a href="/login">Login</a> / <a href="/auth/boxed-signup">Signup</a>
            </button>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="navbar-actions">
          <ul className="navbar-links">
            {links.map((path, i) => (
              <li key={i}>
                <a href={path}>
                  {path === "/" ? "Home" : path.split("/")[1].replace("-", " ").toUpperCase()}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop Cart */}
          <div className="cart-wrapper" ref={cartRef}>
            <div className="cart-icon" onClick={() => setCartOpen(!cartOpen)}>
              <ShoppingCart size={22} />
              {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
            </div>
            {cartOpen && (
              <div className="cart-dropdown clean-card">
                {cartItems.length === 0 ? <p>No items added</p> : cartItems.map((item, idx) => (
                  <div key={idx} className="cart-item-row">
                    <span>{item.name}</span>
                    <strong> ₹ {item.monthlyPrice ?? item.yearlyPrice ?? item.price ?? 0}</strong>
                  </div>
                ))}
                <hr />
                <div className="cart-total-row">
                  <span className="cart-total-label">Total</span>
                 &nbsp;&nbsp; <strong className="cart-total-amount">
                      ₹ {cartItems.reduce((total, item) => {
                      return total + (item.monthlyPrice ?? item.yearlyPrice ?? item.price ?? 0);
                    }, 0).toFixed(2)}
                  </strong>
                </div>

                <button className="blue-btn w-full" onClick={() => navigateTo("/cart")}>Go to Cart</button>
              </div>
            )}
          </div>

          {/* Profile */}
          {isLoggedIn ? (
            <div className="profile-wrapper" ref={menuRef}>
              <div className="profile-avatar" onClick={() => setProfileMenu(!profileMenu)}>
                <User size={22} />
              </div>
              {profileMenu && (
                <div className="profile-dropdown clean-card">
                  <div className="dropdown-wallet">
                    <Wallet size={16} /> <span>{loadingWallet ? "Loading..." : `₹${walletBalance}`}</span>
                  </div>
                  <div className="dropdown-item" onClick={() => navigateTo("/wallet-history")}>
                    <Wallet size={16} /> <span>Wallet History</span>
                  </div>
                  <div className="dropdown-item" onClick={() => navigateTo("/your-instances")}>
                    <Laptop size={16} /> <span>Your Instances</span>
                  </div>
                  <div className="dropdown-item" onClick={() => navigateTo("/change-password")}>
                    <Lock size={16} /> <span>Change Password</span>
                  </div>
                  <div className="dropdown-item" onClick={() => navigateTo("/apps/PaymentListNormal")}>
                    <DollarSign size={16} /> <span>My Payments</span>
                  </div>
                  <div className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={16} /> <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="navbar-btn">
              <a href="/login">Login</a> / <a href="/auth/boxed-signup">Signup</a>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
