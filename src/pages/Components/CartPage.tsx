// ✅ FINAL CART PAGE (UI SAME + FAST CURRENCY + FULL FLOW)

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";
import { toast, ToastContainer } from "react-toastify";
import { Check } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import api from "../../services/api";
import { validateWalletAddAmount } from "../../utils/walletAmount";

/* ================= CURRENCY ================= */

const currencySymbols: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const rates: any = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
};

const getCurrencySymbol = (currency?: string | null) => {
  const raw = (currency || "INR").toUpperCase();
  return currencySymbols[raw] || raw || "₹";
};

const convertPrice = (price: number, currency: string) => {
  return price * (rates[currency] || 1);
};

/* ================= COMPONENT ================= */

const CartPage = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaderSeconds, setLoaderSeconds] = useState(0);

  const [selectedCurrency, setSelectedCurrency] = useState(
    () => localStorage.getItem("orl_currency") || "INR"
  );

  // 🔥 FAST UI currency
  const [fastCurrency, setFastCurrency] = useState(selectedCurrency);

  const loaderRef = useRef<any>(null);

  const token = localStorage.getItem("access_token");
  const userId = localStorage.getItem("userId");

  const notify = (msg: string, type: any = "info") =>
    toast[type](msg, { position: "top-center", autoClose: 2000 });

  const requireLogin = () => {
    if (!token || !userId) {
      notify("Please login to continue", "error");
      navigate("/login");
      return false;
    }
    return true;
  };

  /* ================= LOAD CART ================= */

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orl_cart") || "[]");
    setCartItems(stored);
  }, []);

  /* ================= FAST CURRENCY ================= */

  useEffect(() => {
    const handler = () => {
      const newCurrency = localStorage.getItem("orl_currency") || "INR";

      // ⚡ instant UI
      setFastCurrency(newCurrency);

      // 🐢 background (if needed elsewhere)
      setTimeout(() => {
        setSelectedCurrency(newCurrency);
      }, 0);
    };

    window.addEventListener("orlcurrencychange", handler);
    return () => window.removeEventListener("orlcurrencychange", handler);
  }, []);

  /* ================= INSTANT PRICE UPDATE ================= */

  useEffect(() => {
    if (!cartItems.length) return;

    const updated = cartItems.map((item: any) => {
      let display = convertPrice(item.price, fastCurrency);

      // hourly case
      if (item.billingType === "hourly") {
        const baseMinutes = Number(item.totalMinutes ?? 0);
        const baseHours = baseMinutes > 0 ? baseMinutes / 60 : 1;
        const hours = Number(item.hours ?? 1);
        const perHour = item.price / baseHours;
        display = convertPrice(perHour * hours, fastCurrency);
      }

      return {
        ...item,
        currency: fastCurrency,
        displayPrice: display,
      };
    });

    setCartItems(updated);
    localStorage.setItem("orl_cart", JSON.stringify(updated));
  }, [fastCurrency]);

  /* ================= LOADER ================= */

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

  /* ================= REMOVE ================= */

  const removeItem = (index: number) => {
    const updated = [...cartItems];
    updated.splice(index, 1);

    setCartItems(updated);
    localStorage.setItem("orl_cart", JSON.stringify(updated));

    notify("Item removed", "success");

    if (!updated.length) navigate("/");
  };

  /* ================= WALLET ================= */

  const getWalletBalance = async () => {
    try {
      const res = await api.get(`/api/v1/users/wallet/balance/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return Number(res.data?.balance || 0);
    } catch {
      return 0;
    }
  };

  /* ================= RAZORPAY ================= */

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const openRazorpay = async (
    amount: number,
    planId: number,
    fullPrice: number
  ) => {
    const loaded = await loadRazorpay();

    if (!loaded) {
      notify("Razorpay failed", "error");
      return;
    }

    const orderRes = await api.post(
      `/api/v1/users/create-order/`,
      { amount },
      
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const order = orderRes.data;

    const options = {
      key: order.key_id,
      amount: order.amount,
      currency: "INR",
      name: "OnRequestLab",
      order_id: order.order_id,

      handler: async (response: any) => {
        const verify = await api.post(
          `/api/v1/users/verify-payment/`,
          response,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!verify.data.success) {
          notify("Payment failed", "error");
          return;
        }

        notify("Payment success", "success");

        const sub = await createSubscription(planId, fullPrice);
        if (!sub) return;

        localStorage.removeItem("orl_cart");
        setCartItems([]);

        navigate("/my-subscrption");
      },
    };

    new (window as any).Razorpay(options).open();
  };

  /* ================= CREATE SUB ================= */

  const createSubscription = async (planId: number, price: number) => {
    try {
      const res = await api.post(
        `/api/v1/users/subscriptions/create/${planId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return res.data;
    } catch (err: any) {
      const data = err?.response?.data;

      if (data?.error?.includes("already")) {
        notify("Already active", "info");
        navigate("/my-subscrption");
        return null;
      }

      notify(data?.error || "Failed", "error");
      return null;
    }
  };

  /* ================= CHECKOUT FLOW ================= */

  const handleCheckout = async () => {
    if (!requireLogin()) return;

    if (!cartItems.length) return notify("Cart empty");

    const item = cartItems[0];

    // 🆓 FREE PLAN
    if (item.billingType === "free" || Number(item.price) === 0) {
      notify("Launching lab...");
      navigate(`/lab/${item.course_id}`);
      return;
    }

    setLoading(true);

    try {
      const wallet = await getWalletBalance();
      const price = Number(item.price);

      // wallet = 0
      if (wallet <= 0) {
        notify("Wallet empty");
        await openRazorpay(price, item.planId, price);
        return;
      }

      // wallet < price
      if (wallet < price) {
        const remaining = price - wallet;

        const err = validateWalletAddAmount(remaining);
        if (err) {
          notify(err, "error");
          return;
        }

        notify(`Pay ₹${remaining}`);
        await openRazorpay(remaining, item.planId, price);
        return;
      }

      // wallet enough
      const sub = await createSubscription(item.planId, price);
      if (!sub) return;

      notify("Subscription active");

      localStorage.removeItem("orl_cart");
      setCartItems([]);

      navigate("/my-subscrption");

    } catch {
      notify("Checkout failed", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= TOTAL ================= */

  const total = cartItems.reduce(
    (sum, i) => sum + Number(i.displayPrice ?? i.price ?? 0),
    0
  );

  /* ================= UI ================= */

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

        {!cartItems.length ? (
          <div className="text-center py-40">
            <p className="text-gray-400 mb-6">
              Your cart is empty
            </p>

            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-lg bg-purple-600"
            >
              Browse Labs
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">

            {/* LEFT */}
            <div className="flex-1 border border-gray-700 rounded-2xl p-6 bg-[#0B1228]">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-6 mb-6">

                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold">
                      {item.name}
                    </h2>

                    <p className="text-gray-400 mb-4">
                      {item.description}
                    </p>

                    <ul className="space-y-2">
                      {item.features?.map((f: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-400" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* REMOVE */}
                    <button
                      onClick={() => removeItem(idx)}
                      className="mt-4 text-purple-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  {/* PRICE */}
                  <div className="text-2xl font-bold">
                    {getCurrencySymbol(fastCurrency)}
                    {Number(item.displayPrice).toFixed(2)}
                  </div>

                </div>
              ))}
            </div>

            {/* RIGHT */}
            <div className="w-full lg:w-[350px] border border-gray-700 rounded-2xl p-6 bg-[#0B1228]">
              <h3 className="text-lg font-semibold mb-4">
                Total:
              </h3>

              <p className="text-4xl font-bold mb-6">
                {getCurrencySymbol(fastCurrency)}
                {Number(total).toFixed(2)}
              </p>

              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition"
              >
                Checkout
              </button>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default CartPage;