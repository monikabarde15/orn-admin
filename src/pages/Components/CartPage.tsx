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
      const stored = JSON.parse(localStorage.getItem("orl_cart") || "[]");
      setCartItems(stored);
    } catch {
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // 🔥 HOURS UPDATE — main logic
  const updateHours = (index, hours) => {
    const updated = [...cartItems];
    const h = Math.max(1, Number(hours));
    console.log('h=',h,'pric=',updated[index].basePrice,'cartItems=',cartItems);
    updated[index].hours = h;
    updated[index].price = updated[index].basePrice * h;

    setCartItems(updated);
    localStorage.setItem("orl_cart", JSON.stringify(updated));
  };

  const totalAmount = cartItems.reduce(
    (sum, i) => sum + Number(i.price || 0),
    0
  );

  const removeItem = (index) => {
    setProcessing(true);
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
    localStorage.setItem("orl_cart", JSON.stringify(updated));
    notify("Item removed", "info");
    setProcessing(false);
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
          notify(
            `Subscription for ${lab.name} created automatically!`,
            "success"
          );
        } else {
          notify(`Failed to create subscription for ${lab.name}`, "error");
          return;
        }
      }
 
     const actionnew = formatAction(lab.name);
        let action = "";

        if (actionnew === "terraform") {
          action = "iscsi";
        } else {
          action = actionnew;
        }

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
          if (i.status !== "Launched") return false;

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
            launched?.web_ssh_url ||
            launched?.webssh_url ||
            launched?.web_ssh ||
            launched?.web_ssh_link ||
            launched?.webssh ||
            launched?.console_url ||
            launched?.public_url ||
            launched?.ssh_url ||
            launched?.instance_url ||
            launched?.connect_url ||
            launched?.user_instance_link;

          if (url) window.open(url, "_blank");

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
      };

      new window.Razorpay(options).open();
    } catch (err) {
      notify("Payment Failed!", "error");
    } finally {
      setProcessing(false);
    }
  };
// console.log("cartItems =", cartItems[0] || {});

  const handleCheckout = async () => {
    if (!requireLogin()) return;
    if (loading || processing || upgradeInProgress || isLaunching) return;
    if (!cartItems.length) return notify("Cart empty", "info");
    console.log('cartItems=',cartItems);
    setLoading(true);
    setIsLaunching(true);

    try {
      for (const item of cartItems) {
        if(cartItems.billingType!=="free"){
           console.log('cartItems1=',cartItems);
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch {
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
      const updated = await updateActiveStatus(item);
      if (!updated) {
        notify("Update active failed", "error");
        return;
      }

      notify("Plan activated successfully!", "success");

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
        <h1 className="text-4xl font-bold mb-10">Booking Details</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT SECTION */}
          <div className="w-full lg:w-2/3 space-y-6">
            {cartItems.map((item, idx) => (
              <div
                key={idx}
                className="border p-5 rounded-xl flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center space-x-5">
                  <div className="w-32 h-20 bg-gray-200 rounded-lg" />

                  <div>
                    <h2 className="text-xl font-semibold">{item.name}</h2>

                    <p className="text-sm text-gray-400 mt-1">
                      {item.newdescription}
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      Billing: <span className="font-bold">{item.billingType}</span>
                    </p>

                    {/* HOURS INPUT */}
                    <div className="mt-3">
                      {/* <label className="text-sm text-gray-400">Hours:</label> */}

                      {/* <input
                        type="number"
                        min="1"
                        value={item.hours || 1}
                        onChange={(e) => updateHours(idx, e.target.value)}
                        className="ml-2 px-2 py-1 w-20 bg-gray-800 text-white rounded border border-gray-600"
                      /> */}

                      {/* <p className="text-sm mt-1 text-purple-300">
                        ₹{item.basePrice} / hour
                      </p> */}
                    </div>

                    <button
                      onClick={() => removeItem(idx)}
                      disabled={
                        processing || loading || upgradeInProgress || isLaunching
                      }
                      className="text-purple-600 font-semibold mt-2 hover:underline disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-2xl font-bold">₹{item.price}</div>
              </div>
            ))}

            {!cartItems.length && (
              <p className="text-gray-500 text-xl">Your cart is empty.</p>
            )}
          </div>

          {/* RIGHT SECTION */}
          <div className="w-full lg:w-1/3 border p-6 rounded-2xl shadow-md h-fit">
            <h3 className="text-xl font-bold mb-5">Total:</h3>
            <p className="text-4xl font-bold mb-5">₹{totalAmount}</p>

            {/* UPGRADE BTN */}
            <button
              onClick={() => handleUpgrade(cartItems[0])}
              disabled={!cartItems[0]?.subscription}
              className={`w-full mb-4 px-4 py-3 rounded-xl font-bold text-white ${
                cartItems[0]?.subscription
                  ? "bg-gradient-to-r from-purple-600 to-blue-500 hover:scale-105"
                  : "bg-gray-700 opacity-60 cursor-not-allowed"
              }`}
            >
              Upgrade
            </button>

            {/* CHECKOUT BTN */}
            <button
              onClick={handleCheckout}
              disabled={cartItems[0]?.subscription}
              className={`w-full px-4 py-3 rounded-xl font-bold text-white ${
                !cartItems[0]?.subscription
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105"
                  : "bg-gray-700 opacity-60 cursor-not-allowed"
              }`}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CartPage;
