import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "https://backend.onrequestlab.com/api/v1";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [upgradeInProgress, setUpgradeInProgress] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const pollRef = useRef(null);

  const getCookie = (name) => {
    if (typeof document === "undefined") return "";
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return "";
  };

  const token =
    (getCookie("access") ||
      localStorage.getItem("access") ||
      localStorage.getItem("jwt-auth"))?.trim();
  const userId = getCookie("user_id");

  const notify = (msg, type = "info", opts = {}) =>
    toast[type](msg, {
      position: "top-center",
      autoClose: 2000,
      closeButton: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...opts,
    });

  const requireLogin = () => {
    if (!token || !userId) {
      notify("Please login to continue", "error");
      navigate("/login");
      return false;
    }
    return true;
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("orl_cart") || "[]");
      setCartItems(saved || []);
    } catch {
      setCartItems([]);
    }
  }, []);

  const totalAmount = cartItems.reduce(
    (sum, i) => sum + Number(i.price || 0),
    0
  );

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const removeItem = (index) => {
    setProcessing(true);
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
    localStorage.setItem("orl_cart", JSON.stringify(updated));
    toast.dismiss();
    notify("Item removed from cart", "info");
    setTimeout(() => setProcessing(false), 300);
  };

  const checkWallet = async () => {
    try {
      setProcessing(true);
      const res = await axios.get(`${API_BASE}/users/wallet/balance/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.balance ?? 0;
    } catch {
      return 0;
    } finally {
      setProcessing(false);
    }
  };

  const createSubscriptionOnBackend = async (planId, price) => {
    setProcessing(true);
    try {
      const res = await axios.post(
        `${API_BASE}/users/subscriptions/create/${planId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      const data = err?.response?.data;
      if (data?.error === "Insufficient wallet balance") {
        const balance = data.balance || 0;
        const required = data.required || price;
        const remaining = required - balance;
        notify(
          `Wallet insufficient. Paying ₹${remaining} via Razorpay`,
          "warning"
        );
        await openRazorpay(remaining);
      } else {
        notify(data?.error || "Subscription creation failed", "error");
      }
      return null;
    } finally {
      setProcessing(false);
    }
  };

  const formatAction = (name) => name.split(" ")[0].toLowerCase();

  const launchSingle = async (lab, paymentId) => {
    setProcessing(true);
    setIsLaunching(true);
    try {
      if (!lab.subscription) {
        const createdSub = await createSubscriptionOnBackend(lab.planId);
        if (createdSub) {
          lab.subscription = createdSub;
          notify(`Subscription for ${lab.name} created automatically!`, "success");
        } else {
          notify(`Failed to create subscription for ${lab.name}`, "error");
          return;
        }
      }

      const action = formatAction(lab.name);
      const endpoint =
        paymentId === "free"
          ? `${API_BASE}/users/deploy-free/${action}/`
          : `${API_BASE}/users/deploy/${action}/`;

      const body =
        paymentId === "free"
          ? { user_id: userId, action }
          : { user_id: userId, action, payment_id: paymentId };

      await axios.post(endpoint, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      notify(`Instance ${lab.name} launched successfully!`, "success");
    } catch (err) {
      notify(err?.response?.data?.message || "Instance launch failed", "error");
    } finally {
      setProcessing(false);
    }
  };

  const pollForLaunchedInstances = (paymentId = null) => {
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      try {
        const res = await axios.get(`${API_BASE}/lab/userinst/${userId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const instances = res.data || [];
        const launched = instances.find((i) => {
          const isLaunched = i.status === "Launched";
          if (!isLaunched) return false;

          if (!paymentId) return true;
          if (paymentId === "free")
            return i.is_free || !i.payment_id || i.payment_id === "free";
          return i.payment_id === paymentId;
        });

        if (launched) {
          clearInterval(pollRef.current);
          pollRef.current = null;

          setCartItems([]);
          localStorage.removeItem("orl_cart");

          const url =
            launched.web_ssh_url ||
            launched.webssh_url ||
            launched.user_instance_link;
          if (url) try { window.open(url, "_blank"); } catch (err) {}

          window.location.href = `/lab?user=${userId}`;
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 1000);
  };

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const openRazorpay = async (amount) => {
    setProcessing(true);
    setIsLaunching(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) return notify("Failed to load Razorpay", "error");

      const orderRes = await axios.post(
        `${API_BASE}/users/create-order/`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const order = orderRes.data;

      const options = {
        key: order.key_id,
        amount: order.amount * 100,
        currency: "INR",
        name: "OnRequestLab",
        description: "Lab Instance Payment",
        order_id: order.order_id,
        handler: async function (response) {
          try {
            const verify = await axios.post(
              `${API_BASE}/users/verify-payment/`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!verify.data.success)
              return notify("Payment verification failed", "error");

            notify("Payment Successful! Launching Instances...", "success");

            await Promise.all(
              cartItems.map((item) =>
                launchSingle(item, response.razorpay_payment_id)
              )
            );

            pollForLaunchedInstances();
          } catch {
            notify("Payment verification failed", "error");
          }
        },
        modal: { ondismiss: () => notify("Payment cancelled", "info") },
        theme: { color: "#3399cc" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Razorpay Error:", err);
      notify("Payment Failed!", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckout = async () => {
    if (!requireLogin()) return;
    if (loading || processing || upgradeInProgress || isLaunching) return;
    if (!cartItems.length) return notify("Cart empty", "info");

    setLoading(true);
    setIsLaunching(true);

    try {
      for (const item of cartItems) {
        if (!item.subscription) {
          const sub = await createSubscriptionOnBackend(item.planId);
          item.subscription = sub;
          notify(`Subscription created for ${item.name}`, "success");
        }

        const wallet = await checkWallet();
        const remaining = Math.max(0, item.price - wallet);

        if (remaining === 0) {
          notify(
            `₹${item.price} deducted from Wallet. Launching ${item.name}...`,
            "success"
          );
          await launchSingle(item, "wallet");
        } else {
          notify(
            `Wallet ₹${wallet} insufficient. Paying ₹${remaining} via Razorpay`,
            "warning"
          );
          await openRazorpay(remaining);
        }
      }

      pollForLaunchedInstances();
    } catch (err) {
      notify(err?.response?.data?.message || "Checkout failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateActiveStatus = async (item) => {
    try {
      const res = await axios.post(
        `${API_BASE}/users/update_active/${userId}/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      notify("Failed to update active status", "error");
      return null;
    }
  };

  const handleUpgrade = async (item) => {
    if (!requireLogin()) return;
    if (upgradeInProgress || isLaunching) return;

    const confirmUpgrade = window.confirm("Do you want to upgrade this plan?");
    if (!confirmUpgrade) return;

    setUpgradeInProgress(true);
    setIsLaunching(true);

    try {
      // 1️⃣ Update active first
      const updated = await updateActiveStatus(item);
      if (!updated) {
        notify("Update active failed", "error");
        return;
      }
      notify("Plan activated successfully!", "success");

      // 2️⃣ Upgrade flow
      const wallet = await checkWallet();
      const remaining = Math.max(0, item.price - wallet);

      if (remaining === 0) {
        notify(`₹${item.price} deducted. Upgrading...`, "success");
        await launchSingle(item, "wallet");
        pollForLaunchedInstances();
      } else {
        notify(`Wallet low, paying ₹${remaining} via Razorpay`, "warning");
        await openRazorpay(remaining);
      }
    } catch (err) {
      notify(err?.response?.data?.message || "Upgrade failed", "error");
    } finally {
      setUpgradeInProgress(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />

      {(loading || processing || upgradeInProgress || isLaunching) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-[9999]">
          <div className="w-16 h-16 border-4 border-t-transparent border-purple-400 rounded-full animate-spin"></div>
          <p className="text-white mt-4 text-xl font-semibold">Please wait...</p>
        </div>
      )}

      <div className="min-h-screen bg-[#070B19] text-white px-4 py-10">
        <h1 className="text-4xl font-bold text-center mb-12 text-purple-300">
          🛒 Your Cart
        </h1>

        {!cartItems.length ? (
          <p className="text-center text-xl text-gray-400">Your cart is empty.</p>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {cartItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#10172A] border border-white/10 p-6 rounded-2xl flex justify-between items-center"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-purple-300">
                    {item.name}
                  </h2>
                  <p className="text-gray-300 mt-1">
                    Billing:
                    <span className="text-purple-400 ml-2 font-bold">
                      {item.billingType.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-3xl font-bold text-green-400 mt-3">₹ {item.price}</p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => removeItem(idx)}
                    disabled={processing || loading || upgradeInProgress || isLaunching}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-bold text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="text-4xl font-bold text-right mt-6 text-green-400">
              Total: ₹{totalAmount}
            </div>

              {cartItems.map((item, idx) => (
  <div
    key={idx}
    className="flex flex-col sm:flex-row justify-center items-center mt-4 space-y-2 sm:space-y-0 sm:space-x-4"
  >
    <button
      onClick={() => handleUpgrade(item)}
      disabled={!item.subscription}
      className={`px-6 py-3 rounded-xl font-bold text-white transition-transform duration-200 ${
        item.subscription
          ? "bg-blue-600 hover:bg-blue-700 transform hover:scale-105"
          : "bg-gray-600 cursor-not-allowed"
      }`}
    >
      Upgrade
    </button>

    <button
      onClick={() => handleCheckout(item)}
      disabled={item.subscription}
      className={`px-6 py-3 rounded-xl font-bold text-white transition-transform duration-200 ${
        !item.subscription
          ? "bg-purple-600 hover:bg-purple-700 transform hover:scale-105"
          : "bg-gray-700 cursor-not-allowed"
      }`}
    >
      Checkout
    </button>
  </div>
))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
