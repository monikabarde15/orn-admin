import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { validateWalletAddAmount } from "../../utils/walletAmount";

const WalletAddFunds: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(100);
  const [loading, setLoading] = useState(false);

  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleAddFunds = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }

    const validationError = validateWalletAddAmount(amount);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Failed to load Razorpay.");
        return;
      }

      const orderRes = await api.post("/api/v1/users/create-order/", { amount });
      const order = orderRes.data;

      new (window as any).Razorpay({
        key: order.key_id,
        amount: order.amount, // paise from backend
        currency: order.currency || "INR",
        order_id: order.order_id,
        name: "OnRequestLab Wallet",
        description: "Add funds to wallet",
        handler: async (response: any) => {
          const verifyRes = await api.post("/api/v1/users/verify-payment/", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data?.success) {
            toast.success("Wallet funded successfully.");
            navigate("/wallet-history");
          } else {
            toast.error("Payment verification failed.");
          }
        },
        modal: {
          ondismiss: () => toast.info("Payment cancelled."),
        },
      }).open();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to add funds.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
        <div className="max-w-md mx-auto bg-slate-900 rounded-xl p-6 space-y-4">
          <h1 className="text-2xl font-semibold">Add Funds to Wallet</h1>
          <p className="text-sm text-gray-400">Minimum ₹100, Maximum ₹50,000 per transaction</p>

          <input
            type="number"
            min={100}
            max={50000}
            step={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2"
          />

          <button
            onClick={handleAddFunds}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-60"
          >
            {loading ? "Processing..." : "Add to Wallet"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WalletAddFunds;