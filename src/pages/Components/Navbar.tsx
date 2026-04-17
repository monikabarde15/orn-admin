import React, { useState, useEffect, useRef } from "react";
import "../../pages/Components/Navbar.css";
import logoimg from "../../../public/assets/orllogo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Wallet, User, LogOut, Laptop, ShoppingCart, Lock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const currencySymbols: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const getCurrencySymbol = (currency?: string | null) => {
  const raw = (currency || "INR").toString().split("-")[0].trim().toUpperCase();
  return currencySymbols[raw] || raw || "₹";
};

const Navbar = () => {
          const navigate = useNavigate();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem("orl_cart") || "[]"));
  const [cartOpen, setCartOpen] = useState(false);
  const logoutTimerRef = useRef<any>(null);


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [loadingWallet, setLoadingWallet] = useState(false);

  const currencyOptions = ["INR", "USD", "EUR"];
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    () => localStorage.getItem("orl_currency") || "INR"
  );

  useEffect(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    const expiresAtRaw = localStorage.getItem("session_expires_at");
    if (!expiresAtRaw) return;

    const expiresAt = Number(expiresAtRaw);
    if (!Number.isFinite(expiresAt)) return;

    const delay = expiresAt - Date.now();
    if (delay <= 0) {
      handleLogout();
      return;
    }

    logoutTimerRef.current = setTimeout(() => {
      handleLogout();
    }, delay);

    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

useEffect(() => {
  if (isLoggedIn && profile?.currency) {
    const normalized = profile.currency.toString().split("-")[0].trim().toUpperCase();
    if (currencyOptions.includes(normalized)) {
      setSelectedCurrency(normalized);
      localStorage.setItem("orl_currency", normalized);
    }
  }
}, [isLoggedIn, profile]);

const handleCurrencyChange = async (e: any) => {
  const next = e?.target?.value;
  if (!next || !currencyOptions.includes(next)) return;

  setSelectedCurrency(next);
  localStorage.setItem("orl_currency", next);
  window.dispatchEvent(new Event("orlcurrencychange"));

  // Persist for authenticated users (best effort; UI already updates via query param).
  try {
    const token = localStorage.getItem("access_token");
    if (token) {
      await api.patch("/api/v1/users/profile/update/", { currency: next });
    }
  } catch (err) {
    console.error("Currency persist failed:", err);
  }
};

// const fetchProfile = async () => {
//   try {
//     const res = await api.get("/api/v1/users/profile/");
//     setProfile(res.data);

//     // 🔥 LOGIN CONFIRMATION
//     setIsLoggedIn(true);

//     // wallet bhi yahin se
//     fetchWalletBalance();
//   } catch (err) {
//     console.error("Profile fetch failed:", err);
//     setIsLoggedIn(false);
//   } finally {
//     setProfileLoading(false);
//   }
// };

const fetchProfile = async () => {
  try {
    setProfileLoading(true);
    const res = await api.get("/api/v1/users/profile/");
    setProfile(res.data);
  } catch (err) {
    console.error("Profile fetch failed:", err);
    setIsLoggedIn(false); // token invalid ho to logout state
  } finally {
    setProfileLoading(false);
  }
};

useEffect(() => {
  const token = localStorage.getItem("access_token"); // ✅ SAME AS ADMIN

  if (token) {
    fetchProfile();   // ✅ profile decides login
  } else {
    setIsLoggedIn(false);
    setProfileLoading(false);
  }
}, []);

console.log("isLoggedIn:", isLoggedIn);
console.log("profile:", profile);
const user = profile;
useEffect(() => {
  if (!profile) return;

  if (profile.is_superuser === true) {
    // 🔒 SUPERADMIN GUARD
    if (!window.location.pathname.startsWith("/index")) {
      navigate("/index", { replace: true });
    }
  }
}, [profile, navigate]);

const fetchWalletBalance = async () => {
  try {
    setLoadingWallet(true);
    const res = await api.get("/api/v1/users/wallet/balance/");
    setWalletBalance(res.data?.balance ?? res.data?.wallet_amount ?? 0);
  } catch (err) {
    console.error("Wallet fetch error:", err);
    setWalletBalance(0);
  } finally {
    setLoadingWallet(false);
  }
};
const menuRef = useRef(null);
const cartRef = useRef(null); // ✅ REQUIRED
useEffect(() => {
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setProfileMenu(false);
    }

    if (cartRef.current && !cartRef.current.contains(e.target)) {
      setCartOpen(false);
    }
  };

  const handleStorageChange = () => {
    setCartItems(JSON.parse(localStorage.getItem("orl_cart") || "[]"));
  };

  document.addEventListener("mousedown", handleClickOutside);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);
useEffect(() => {
  const token = localStorage.getItem("access_token");

  if (token) {
    setIsLoggedIn(true);
  } else {
    setIsLoggedIn(false);
  }
}, []);
useEffect(() => {
  if (isLoggedIn) {
    fetchProfile();
    fetchWalletBalance();
  }
}, [isLoggedIn]);


const handleLogout = async () => {
  try {
    // await api.post("/api/v1/users/auth/logout/");
    const refresh = localStorage.getItem("refresh_token");
    if (refresh) {
      await api.post("/api/v1/users/logout/", { refresh });
    } else {
      await api.post("/api/v1/users/logout/", { refresh: "" });
    }
  } catch (err) {
    console.warn("Logout API failed:", err);
  } finally {
    localStorage.setItem("logout_at", String(Date.now()));
    localStorage.removeItem("session_expires_at");
    localStorage.removeItem("login_at");

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userId");

    setIsLoggedIn(false);
    setProfile(null);

    toast.info("You have been logged out!", { position: "top-center" });

    setTimeout(() => {
      window.location.href = "/";
    }, 800);
  }
};
const profileImage = profile?.profile_image
  ? profile.profile_image.startsWith("http")
    ? profile.profile_image
    : `https://${profile.profile_image}`
  : "https://t4.ftcdn.net/jpg/01/24/65/69/240_F_124656969_x3y8YVzvrqFZyv3YLWNo6PJaC88SYxqM.jpg";

  const navigateTo = (path) => (window.location.href = path);

  const links = isLoggedIn
    ? ["/", "/about-us", "/labs", "/blogs","/contact-us"]
    : ["/", "/about-us", "/labs", "/blogs", "/contact-us"];

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
                    <strong>
                      {getCurrencySymbol(item.currency)}
                      {Number(item.displayPrice ?? item.monthlyPrice ?? item.yearlyPrice ?? item.price ?? 0)}
                    </strong>
                  </div>
                ))}
                <div className="cart-total-row">
                  <span className="cart-total-label">Total</span>
                  <div className="vertical-line"></div>
                  <strong className="cart-total-amount">
                    {getCurrencySymbol(cartItems[0]?.currency)}
                    {cartItems
                      .reduce((total, item) => {
                        return total + Number(item.displayPrice ?? item.monthlyPrice ?? item.yearlyPrice ?? item.price ?? 0);
                      }, 0)
                      .toFixed(2)}
                  </strong>
                </div>

                <button className="blue-btn w-full" onClick={() => navigateTo("/cart")}>Go to Cart</button>
              </div>
            )}
          </div>

          {/* Mobile Profile */}
          {isLoggedIn ? (
            <div className="mobile-profile">
              <div className="blue-btn">
                <p>{(user?.name || "").slice(0, 5) + (user?.name?.length > 2 ? "..." : "")}</p>
              </div>

              {/* Currency Selector */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <DollarSign size={16} />
                <select
                  value={selectedCurrency}
                  onChange={handleCurrencyChange}
                  style={{
                    background: "transparent",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 8,
                    padding: "6px 10px",
                    outline: "none",
                  }}
                >
                  {currencyOptions.map((c) => (
                    <option
                      key={c}
                      value={c}
                      style={{ backgroundColor: "#111827", color: "#ffffff" }}
                    >
                      {c}
                    </option>
                  ))}
                </select>
              </div>

                  
              <p className="wallet-line">
                <Wallet size={16} /> {loadingWallet ? "Loading..." : `₹${walletBalance}`}
              </p> 
              <button className="blue-btn" onClick={() => navigateTo("/wallet/add-funds")}>Add Funds</button>
              <button className="blue-btn" onClick={() => navigateTo("/wallet-history")}>Wallet History</button>
               <button className="blue-btn" onClick={() => navigateTo("/my-subscrption")}>My Subscrption</button>
                <button className="blue-btn" onClick={() => navigateTo("/certificate")}>My Certificatons</button>
              
              <button className="blue-btn" onClick={() => navigateTo("/your-instances")}>My Instances</button>
              <button className="red-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <DollarSign size={16} />
                <select
                  value={selectedCurrency}
                  onChange={handleCurrencyChange}
                  style={{
                    background: "transparent",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 8,
                    padding: "6px 10px",
                    outline: "none",
                  }}
                >
                  {currencyOptions.map((c) => (
                    <option
                      key={c}
                      value={c}
                      style={{ backgroundColor: "#111827", color: "#ffffff" }}
                    >
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Icon-only auth button (keeps space for currency) */}
              <button
                className="navbar-btn mobile-login-btn"
                onClick={() => navigateTo("/login")}
                title="Login"
              >
                <User size={18} />
              </button>
            </div>
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
                    <strong>
                      {getCurrencySymbol(item.currency)}
                      {Number(item.displayPrice ?? item.monthlyPrice ?? item.yearlyPrice ?? item.price ?? 0)}
                    </strong>
                  </div>
                ))}
                <hr />
                <div className="cart-total-row">
                  <span className="cart-total-label">Total</span>
                 &nbsp;&nbsp; <strong className="cart-total-amount">
                      {getCurrencySymbol(cartItems[0]?.currency)}
                      {cartItems
                        .reduce((total, item) => {
                          return total + Number(item.displayPrice ?? item.monthlyPrice ?? item.yearlyPrice ?? item.price ?? 0);
                        }, 0)
                        .toFixed(2)}
                  </strong>
                </div>

                <button className="blue-btn w-full" onClick={() => navigateTo("/cart")}>Go to Cart</button>
              </div>
            )}
          </div>

          {/* Currency Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 8px" }}>
            <DollarSign size={18} />
            <select
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 8,
                padding: "6px 10px",
                outline: "none",
              }}
            >
              {currencyOptions.map((c) => (
                <option
                  key={c}
                  value={c}
                  style={{ backgroundColor: "#111827", color: "#ffffff" }}
                >
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Profile */}
          {isLoggedIn ? (
            <div className="profile-wrapper" ref={menuRef}>
              <div className="profile-avatar" onClick={() => setProfileMenu(!profileMenu)}>
                {/* <User size={22} /> */}
               <img
                src={profileImage}
                alt="profile"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />


              </div>
              {profileMenu && (
                <div className="profile-dropdown clean-card">
                  <div className="dropdown-wallet">
                    {/* <p>{user.name||''}</p> */}
                     <p onClick={() => navigateTo("/users/user-profile")} >{(user?.username || "").slice(0, 5) + (user?.username?.length > 4 ? "..." : "")}</p>
                  </div>
                  
                  <div className="dropdown-wallet">
                    <Wallet size={16} /> <span>{loadingWallet ? "Loading..." : `₹${walletBalance}`}</span>
                  </div>

                  <div className="dropdown-item" onClick={() => navigateTo("/wallet/add-funds")}>
                    <Wallet size={16} /> <span>Add Funds</span>
                  </div>
                 
                  <div className="dropdown-item" onClick={() => navigateTo("/wallet-history")}>
                    <Wallet size={16} /> <span>Wallet History</span>
                  </div>
                  <div className="dropdown-item" onClick={() => navigateTo("/your-instances")}>
                    <Laptop size={16} /> <span>My Instances</span>
                  </div>
                   <div className="dropdown-item" onClick={() => navigateTo("/my-subscrption")}>
                    <Laptop size={16} /> <span>My Subscrption</span>
                  </div>
                   <div className="dropdown-item" onClick={() => navigateTo("/certificate")}>
                    <Laptop size={16} /> <span>My Certificatons</span>
                  </div>
                  <div className="dropdown-item" onClick={() => navigateTo("/change-password")}>
                    <Lock size={16} /> <span>Change Password</span>
                  </div>
                  <div className="dropdown-item" onClick={() => navigateTo("/payment-list")}>
                    <DollarSign size={16} /> <span>My Payments</span>
                  </div>
                  <div className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={16} /> <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className="navbar-btn"
              onClick={() => navigateTo("/login")}
              title="Login"
            >
              <User size={18} />
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
