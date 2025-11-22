import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";

import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "https://backend.onrequestlab.com/api/v1";

interface CartItem {
  planId: string;
  name: string;
  billingType: string;
  price: number;
}

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const pollRef = useRef<any>(null);

  // ---------------- COOKIE ----------------
  const getCookie = (name) => {
    if (typeof document === "undefined") return "";
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return "";
  };

  const tokenFromCookie = getCookie("access");
  const userId = getCookie("user_id");
  const tokenFromStorage =
    localStorage.getItem("jwt-auth") ||
    localStorage.getItem("access") ||
    localStorage.getItem("token") ||
    "";
  const token = (tokenFromCookie || tokenFromStorage || "").trim();

  // const userId = getCookie("user_id");

  // ---------------- LOAD CART ----------------
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("orl_cart") || "[]");
    setCartItems(saved);
  }, []);

  const totalAmount = cartItems.reduce((sum, i) => sum + i.price, 0);

  // ---------------- LOAD RAZORPAY ----------------
  const loadScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // ---------------- REMOVE ITEM ----------------
  const removeItem = (planId: string, billingType: string) => {
    const updated = cartItems.filter(
      (i) => !(i.planId === planId && i.billingType === billingType)
    );
    setCartItems(updated);
    localStorage.setItem("orl_cart", JSON.stringify(updated));
    toast.info("🗑️ Item removed");
  };

  // ---------------- CREATE ORDER ----------------
  const createOrder = async (amount: number) => {
    try {
      const res = await axios.post(
        `${API_BASE}/users/create-order/`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch {
      toast.error("❌ Failed to create order");
      navigate("/login");
      return null;
    }
  };

  // ---------------- VERIFY PAYMENT ----------------
  const verifyPayment = async (payload: any) => {
    try {
      const res = await axios.post(
        `${API_BASE}/users/verify-payment/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch {
      toast.error("❌ Payment verification failed");
      return null;
    }
  };

  // ---------------- POLLING ----------------
  const startPolling = (payment_id: string) => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await axios.get(`${API_BASE}/lab/userinst/${userId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = res.data || [];

        const newly = list.find((i: any) => {
          const launched = i.status === "Launched";
          const payMatch =
            payment_id === "free"
              ? i.is_free || !i.payment_id
              : i.payment_id === payment_id;
          return launched && payMatch;
        });

        if (newly) {
          clearInterval(pollRef.current);
          toast.success("🚀 Instance Launched Successfully!");
          navigate("/");

          const url =
            newly.web_ssh_url ||
            newly.webssh_url ||
            newly.user_instance_link;

          if (url) window.open(url, "_blank");

          setProcessing(false);
          navigate("/instances");
        }
      } catch {}
    }, 3000);
  };

  const formatAction = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");

  // ---------------- LAUNCH SINGLE ----------------
  const launchSingleInstance = async (lab: CartItem, paymentId: string) => {
    try {
      const actionName = formatAction(lab.name);

      const endpoint =
        paymentId === "free"
          ? `${API_BASE}/users/deploy-free/${actionName}/`
          : `${API_BASE}/users/deploy/${actionName}/`;

      const payload: any = {
        user_id: userId,
        action: lab.name,
      };
      if (paymentId !== "free") payload.payment_id = paymentId;

      await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      startPolling(paymentId);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Instance launch failed";

      toast.error(`❌ ${msg}`);
      setProcessing(false);
    }
  };

  // ---------------- LAUNCH ALL ----------------
  const launchAll = async (paymentId: string) => {
    for (const item of cartItems) {
      await launchSingleInstance(item, paymentId);
    }
    localStorage.removeItem("orl_cart");
  };

  // ---------------- CHECKOUT ----------------
  const checkout = async () => {
    if (loading || processing) return;
    if (!cartItems.length) return toast.error("🛒 Cart is empty");

    setLoading(true);

    const loaded = await loadScript();
    if (!loaded) {
      toast.error("Razorpay failed to load");
      setLoading(false);
      return;
    }

    const order = await createOrder(totalAmount);
    if (!order) return setLoading(false);

    const options: any = {
      key: order.key_id,
      amount: totalAmount * 100,
      currency: "INR",
      name: "OnRequestLab",
      order_id: order.order_id,

      handler: async (resp: any) => {
        setProcessing(true);
        setLoading(false);

        const verify = await verifyPayment({
          order_id: order.order_id,
          razorpay_payment_id: resp.razorpay_payment_id,
          razorpay_order_id: resp.razorpay_order_id,
          razorpay_signature: resp.razorpay_signature,
        });

        if (!verify || !verify.success) {
          toast.error("❌ Payment verification failed");
          setProcessing(false);
          return;
        }

        toast.success("🎉 Payment Successful!");
        await launchAll(resp.razorpay_payment_id);
      },
    };

    new (window as any).Razorpay(options).open();
  };

  // ---------------- UI ----------------
  return (
  <>
    <Navbar />

    <div className="min-h-screen bg-[#070B19] text-white px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-12 tracking-wide text-purple-300">
        🛒 Your Cart
      </h1>

      {!cartItems.length ? (
        <p className="text-center text-xl text-gray-400">
          Your cart is empty. Add something!
        </p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {cartItems.map((item, i) => (
            <div
              key={i}
              className="
                bg-[#10172A]
                border border-white/10 
                p-6 rounded-2xl shadow-lg 
                flex justify-between items-center
                transition-all duration-300
                hover:scale-[1.02]
                hover:shadow-purple-500/30
              "
            >
              <div>
                <h2 className="text-2xl font-semibold text-purple-300">
                  {item.name}
                </h2>

                <p className="text-gray-300 mt-1">
                  Billing:{" "}
                  <span className="text-purple-400 font-bold">
                    {item.billingType.toUpperCase()}
                  </span>
                </p>

                {/* PRICE FIXED (Bright, visible) */}
                <p className="text-3xl font-bold text-green-400 mt-3 drop-shadow-lg">
                  ₹ {item.price}
                </p>
              </div>

              <button
                className="
                  bg-red-600 
                  hover:bg-red-700 
                  transition-all 
                  px-6 py-2 rounded-xl text-lg 
                  hover:shadow-red-500/30
                "
                onClick={() => removeItem(item.planId, item.billingType)}
                disabled={processing}
              >
                Remove
              </button>
            </div>
          ))}

          {/* TOTAL FIX (Bright, visible) */}
          <div className="text-4xl font-bold text-right mt-6 text-green-400 drop-shadow-xl">
            Total: ₹{totalAmount}
          </div>

          {/* CHECKOUT BUTTON FIX (Brighter + Visible) */}
          <button
            onClick={checkout}
            disabled={loading || processing}
            className={`
              w-full py-4 rounded-xl mt-5 text-2xl font-semibold
              transition-all duration-300 shadow-xl
              ${
                loading || processing
                  ? "bg-gray-700 cursor-not-allowed"
                  : "w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40"
              }
            `}
          >
            {loading
              ? "Processing Payment..."
              : processing
              ? "Launching Instances..."
              : "Checkout & Pay"}
          </button>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
    </div>

    <Footer />
  </>
);

};

export default CartPage;
