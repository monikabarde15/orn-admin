import React, { useState } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LabPricing = () => {
  const [billingType, setBillingType] = useState("monthly");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const PRICES = {
    monthly: 499,
    yearly: 4999,
  };

  // -----------------------------
  // 1️⃣ CREATE SUBSCRIPTION ORDER
  // -----------------------------
  const createSubscriptionOrder = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        "https://dev.backend.onrequestlab.com/api/v1/payment/subscription/create",
        {
          planType: billingType, // monthly / yearly
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data; // order_id, amount
    } catch (err) {
      alert("Failed to create subscription order.");
      setLoading(false);
      return null;
    }
  };

  // -----------------------------
  // 2️⃣ OPEN RAZORPAY
  // -----------------------------
  const openRazorpay = (order) => {
    return new Promise((resolve, reject) => {
      const options = {
        key: "rzp_test_xxxxx", // ← आपका Razorpay key यहाँ आएगा
        amount: order.amount,
        currency: "INR",
        name: "OnRequest Lab",
        description: "Subscription Payment",
        order_id: order.order_id,
        handler: function (response) {
          resolve(response); // payment_id, signature
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: "#4f46e5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => reject("Payment failed"));
      rzp.open();
    });
  };

  // -----------------------------
  // 3️⃣ VERIFY PAYMENT + ACTIVATE SUBSCRIPTION
  // -----------------------------
  const verifyPayment = async (paymentData, orderId) => {
    try {
      const verifyRes = await axios.post(
        "https://dev.backend.onrequestlab.com/api/v1/payment/subscription/verify",
        {
          ...paymentData,
          order_id: orderId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return verifyRes.data;
    } catch (err) {
      alert("Payment verification failed!");
      return null;
    }
  };

  // -----------------------------
  // 🌟 MAIN FUNCTION - PAYMENT START
  // -----------------------------
  const handleBuyNow = async () => {
    if (!token) {
      alert("Session expired! Please login again.");
      return navigate("/login");
    }

    // 1. CREATE ORDER
    const order = await createSubscriptionOrder();
    if (!order) return;

    // 2. OPEN RAZORPAY
    let paymentData;
    try {
      paymentData = await openRazorpay(order);
    } catch (err) {
      alert(err);
      setLoading(false);
      return;
    }

    // 3. VERIFY PAYMENT
    const verify = await verifyPayment(paymentData, order.order_id);

    if (verify?.success) {
      alert("Subscription activated successfully!");
      navigate("/dashboard");
    } else {
      alert("Verification failed.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Choose Your Plan</h2>

      {/* Billing Switch */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${billingType === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setBillingType("monthly")}
        >
          Monthly
        </button>
        <button
          className={`px-4 py-2 rounded ${billingType === "yearly" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setBillingType("yearly")}
        >
          Yearly
        </button>
      </div>

      {/* Pricing Card */}
      <div className="border p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-2">
          {billingType === "monthly" ? "Monthly Subscription" : "Yearly Subscription"}
        </h3>

        <p className="text-3xl font-bold mb-4">
          ₹{PRICES[billingType]}
        </p>

        <ul className="mb-4 space-y-2">
          <li className="flex items-center gap-2"><Check size={18}/> Unlimited Labs</li>
          <li className="flex items-center gap-2"><Check size={18}/> Priority Support</li>
          <li className="flex items-center gap-2"><Check size={18}/> Free Updates</li>
        </ul>

        <button
          disabled={loading}
          onClick={handleBuyNow}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          {loading ? "Processing..." : "Buy Now"}
        </button>
      </div>
    </div>
  );
};

export default LabPricing;
