import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://dev.backend.onrequestlab.com/api/v1";

// Razorpay loader
const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (typeof document === "undefined") return resolve(false);
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// API calls
const payRazorApi = async (amount: number) => {
  try {
    const res = await axios.post(`${API_BASE}/users/create-order/`, { amount });
    return res.data; // { id, amount, currency, key_id }
  } catch (err) {
    console.error("payRazorApi error:", err);
    return null;
  }
};

payRazorApi.verifyPayment = async (response: any) => {
  try {
    const res = await axios.post(`${API_BASE}/users/verify-payment/`, response);
    return res.data; // { success: true/false }
  } catch (err) {
    console.error("verifyPayment error:", err);
    return { success: false };
  }
};

const createInstanceApi = async (planId: string) => {
  try {
    const res = await axios.post(`${API_BASE}/users/deploy/${planId}/`);
    return res.data; // { web_ssh_url }
  } catch (err) {
    console.error("createInstanceApi error:", err);
    return null;
  }
};

interface CheckoutProps {}

const Checkout: React.FC<CheckoutProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];
  const [loading, setLoading] = useState(false);

  const item = cartItems.length > 0 ? cartItems[0] : null;

  const payAndLaunch = async () => {
    if (!item) {
      alert("Cart is empty!");
      return;
    }
    setLoading(true);

    try {
      if (item.billingType === "free") {
        await launchInstance(item.planId);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay");
        setLoading(false);
        return;
      }

      const orderData = await payRazorApi(item.price);
      if (!orderData?.id) {
        alert("Unable to initialize payment.");
        setLoading(false);
        return;
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "OnRequestLab",
        description: item.name,
        order_id: orderData.id,
        handler: async (response: any) => {
          const verify = await payRazorApi.verifyPayment(response);
          if (verify.success) {
            await launchInstance(item.planId);
          } else {
            alert("Payment verification failed!");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            alert("Payment cancelled");
            setLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (res: any) => {
        alert("Payment failed: " + res.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
      setLoading(false);
    }
  };

  const launchInstance = async (planId: string) => {
    try {
      const inst = await createInstanceApi(planId);
      if (inst?.web_ssh_url) {
        window.location.href = inst.web_ssh_url;
      } else {
        navigate("/instances");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to launch instance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-16">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <h2 className="text-3xl font-bold text-center text-white">Checkout</h2>
        <p className="text-center text-lg text-gray-300">
          Total: ₹{item?.price || 0}
        </p>
        <button
          onClick={payAndLaunch}
          disabled={loading || !item}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold text-lg shadow-lg hover:scale-105 transform transition-all"
        >
          {loading ? "Processing..." : "Pay & Launch"}
        </button>
        {!item && (
          <p className="text-center text-red-500">No items in your cart.</p>
        )}
      </div>
    </div>
  );
};

export default Checkout;
