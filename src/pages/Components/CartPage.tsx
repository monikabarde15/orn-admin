import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../services/api";

const CartPage = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaderSeconds, setLoaderSeconds] = useState(0);
  const [subscriptionActive, setSubscriptionActive] = useState(false);

  const loaderRef = useRef(null);

  const token = localStorage.getItem("access_token");
  const userId = localStorage.getItem("userId");

  const notify = (msg, type = "info") =>
    toast[type](msg, { position: "top-center", autoClose: 2000 });

  const requireLogin = () => {
    if (!token || !userId) {
      notify("Please login to continue", "error");
      navigate("/login");
      return false;
    }
    return true;
  };

  // Load cart
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orl_cart") || "[]");
    setCartItems(stored);
  }, []);

  // Loader Timer
  useEffect(() => {
    if (loading) {
      loaderRef.current = setInterval(
        () => setLoaderSeconds((prev) => prev + 1),
        1000
      );
    } else {
      clearInterval(loaderRef.current);
      setLoaderSeconds(0);
    }
    return () => clearInterval(loaderRef.current);
  }, [loading]);

  const totalAmount = cartItems.reduce(
    (sum, i) => sum + Number(i.price || 0),
    0
  );

  // 🔎 Check active subscription
  const checkActiveSubscription = async (planId) => {
    try {
      const res = await api.get( 
      `api/v1/users/subscriptions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const activePlans = res.data || [];

      const isActive = activePlans.some(
        (sub) => sub.plan_id === planId && sub.active === true
      );

      setSubscriptionActive(isActive);
      return isActive;

    } catch {
      return false;
    }
  };

  // Auto check on load
  useEffect(() => {
    if (cartItems.length) {
      checkActiveSubscription(cartItems[0].planId);
    }
  }, [cartItems]);

  // 🗑 Remove
  const removeItem = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
    localStorage.setItem("orl_cart", JSON.stringify(updated));

    notify("Item removed", "success");

    if (updated.length === 0) navigate("/");
  };

  // 💳 Razorpay
  const openRazorpay = async (amount, planId) => {
    const alreadyActive = await checkActiveSubscription(planId);
    if (alreadyActive) {
      notify("Subscription already active.", "info");
      navigate("/my-subscrption");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);

    const orderRes = await api.post(
      `api/v1/users/create-order/`,
      { amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const order = orderRes.data;

    const options = {
      key: order.key_id,
      amount: order.amount * 100,
      currency: "INR",
      name: "OnRequestLab",
      description: "Plan Payment",
      order_id: order.order_id,

      handler: async function (response) {
        const verify = await api.post(
          `api/v1/users/verify-payment/`,
          {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!verify.data.success) {
          notify("Payment verification failed", "error");
          return;
        }

        notify("Payment Successful!", "success");

        localStorage.removeItem("orl_cart");
        setCartItems([]);

        navigate("/my-subscrption");
      },
    };

    new window.Razorpay(options).open();
  };

  // 🔒 Create Subscription
  const createSubscription = async (planId, price) => {
  try {
    const res = await api.post(
      `api/v1/users/subscriptions/create/${planId}/`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;

  } catch (err) {
    const data = err?.response?.data;
    console.log('data=',data);

    // 🚫 If backend says already exists
    if (
      data?.error?.toLowerCase().includes("already")
    ) {
      notify("Subscription already active.", "info");
      navigate("/my-subscrption");
      return null;
    }

    // 💳 Only open Razorpay if wallet insufficient
    if (data?.error === "Insufficient wallet balance") {
      const remaining =
        (data.required || price) - (data.balance || 0);

      await openRazorpay(remaining, planId);
      return null;
    }

    notify(data?.error || "Subscription failed", "error");
    return null;
  }
};



  // 🔥 Checkout
const handleCheckout = async () => {
  if (!requireLogin()) return;
  if (!cartItems.length) return notify("Cart empty", "info");

  const item = cartItems[0];

  setLoading(true);

  try {
    const alreadyActive = await checkActiveSubscription(item.planId);

    if (alreadyActive) {
      notify("Plan already active.", "info");
      navigate("/my-subscrption");
      return;
    }

    const sub = await createSubscription(item.planId, item.price);

    if (!sub) return;

    notify("Subscription activated successfully!", "success");

    localStorage.removeItem("orl_cart");
    setCartItems([]);

    navigate("/my-subscrption");

  } catch (err) {
    notify("Checkout failed", "error");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <Navbar />
      <ToastContainer />

      {loading && (
        <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-[9999]">
          <div className="w-16 h-16 border-4 border-t-transparent border-purple-400 rounded-full animate-spin"></div>
          <p className="text-purple-300 mt-2">
            Processing time: {loaderSeconds}s
          </p>
        </div>
      )}

      <div className="min-h-screen bg-[#050B1E] text-white px-8 py-10">
        <h1 className="text-4xl font-semibold mb-10">
          Booking Details
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 border border-gray-700 rounded-2xl p-6 bg-[#0B1228]">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="w-32 h-24 bg-gray-300 rounded-xl"></div>

                <div className="flex-1">
                  <h2 className="text-2xl font-semibold flex items-center gap-3">
                    {item.name}
                    {subscriptionActive && (
                      <span className="text-xs bg-green-600 px-2 py-1 rounded">
                        Active
                      </span>
                    )}
                  </h2>

                  <p className="text-gray-400 mt-2 text-sm">
                    {item.newdescription}
                  </p>

                  <button
                    onClick={() => removeItem(idx)}
                    className="mt-4 text-purple-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>

                <div className="text-2xl font-bold">
                  ₹{item.price}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-[350px] border border-gray-700 rounded-2xl p-6 bg-[#0B1228]">
            <h3 className="text-lg font-semibold mb-4">Total:</h3>
            <p className="text-4xl font-bold mb-6">₹{totalAmount}</p>

            <button
              onClick={handleCheckout}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition"
            >
              {subscriptionActive ? "View Subscription" : "Activate Plan"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CartPage;
