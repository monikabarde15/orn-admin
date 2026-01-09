import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

console.log(import.meta.env.VITE_API_URL);
const VIT=import.meta.env.VITE_API_URL;

const API_BASE = `${VIT}/api/v1`;

const notify = (msg, type = "info") =>
  toast[type](msg, { position: "top-center", autoClose: 2500 });

export default function MySubscriptions() {
  const navigate = useNavigate();

  /* ================= AUTH ================= */
  const getCookie = (name) => {
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return "";
  };

  const token =
    getCookie("access") ||
    localStorage.getItem("jwt-auth") ||
    localStorage.getItem("token") ||
    "";

  const userId = getCookie("user_id");

  /* ================= STATE ================= */
  const [subscriptions, setSubscriptions] = useState([]);
  const [wallet, setWallet] = useState(0);

  const [expiredPlans, setExpiredPlans] = useState([]);
  const [popupPlan, setPopupPlan] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [processing, setProcessing] = useState(false);

  /* ================= HELPERS ================= */
  const isActive = (p) =>
    p.expires_at && new Date(p.expires_at) > new Date();

  const getAction = (name = "") => {
  const n = name.toLowerCase();

  if (n.includes("docker")) return "docker";
  if (n.includes("kubernetes") || n.includes("k8s")) return "kubernetes";
  if (n.includes("linux")) return "linux";
  if (n.includes("redhat") || n.includes("rhel")) return "redhat";
  if (n.includes("terraform")) return "terraform";
  if (n.includes("iscsi")) return "iscsi";
  if (n.includes("python")) return "python";
  if (n.includes("jenkins")) return "jenkins";

  return null; // ❗ IMPORTANT
};


  /* ================= FETCH ================= */
  const fetchSubscriptions = async () => {
    const res = await axios.get(
      `${API_BASE}/users/subscriptions/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSubscriptions(res.data || []);
  };

  const fetchWallet = async () => {
    const res = await axios.get(
      `${API_BASE}/users/wallet/balance/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setWallet(res.data?.balance || 0);
  };

  useEffect(() => {
    fetchSubscriptions();
    fetchWallet();
  }, []);

  /* ================= POPUP ON REFRESH ================= */
  useEffect(() => {
    if (!subscriptions.length) return;

    const expired = subscriptions.filter((p) => !isActive(p));
    setExpiredPlans(expired);

    if (expired.length > 0) {
      setPopupPlan(expired[0]);
      setShowPopup(true);
    }
  }, [subscriptions]);

  /* ================= RAZORPAY ================= */
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
    const loaded = await loadRazorpay();
    if (!loaded) throw new Error("Razorpay load failed");

    const orderRes = await axios.post(
      `${API_BASE}/users/create-order/`,
      { amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const order = orderRes.data;

    return new Promise((resolve, reject) => {
      new window.Razorpay({
        key: order.key_id,
        amount: order.amount * 100,
        currency: "INR",
        name: "OnRequestLab",
        order_id: order.order_id,

        handler: async (response) => {
          try {
            await axios.post(
              `${API_BASE}/users/verify-payment/`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            resolve(true);
          } catch {
            reject("Verification failed");
          }
        },

        modal: {
          ondismiss: () => reject("Payment cancelled"),
        },
      }).open();
    });
  };

  /* ================= UPGRADE ================= */
  const handleUpgrade = async (plan) => {
    if (processing) return;
    setProcessing(true);

    try {
      const remaining = Math.max(0, plan.price - wallet);

      // ✅ Wallet enough
      if (remaining === 0) {
        await axios.post(
          `${API_BASE}/users/update_active/${userId}/`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        notify("Plan upgraded successfully", "success");
        setShowPopup(false);
        fetchSubscriptions();
        fetchWallet();
       
        return;
      }

      // ❌ Wallet low → Razorpay
      notify(`Wallet low, paying ₹${remaining}`, "warning");
      await openRazorpay(remaining);

      // 🔥 FINAL UPGRADE API
      await axios.post(
        `${API_BASE}/users/update_active/${userId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      notify("Payment successful & plan upgraded", "success");
      setShowPopup(false);
      fetchSubscriptions();
      fetchWallet();
       setPopupPlan(null);
        setTimeout(() => {
          window.location.reload();
        }, 1000);

    } catch (err) {
      notify(
        typeof err === "string" ? err : "Upgrade failed",
        "error"
      );
    } finally {
      setProcessing(false);
    }
  };

  /* ================= ACTIONS ================= */
  // const launchLab = async (plan) => {
  //   const action = getAction(plan.name);
  //   await axios.post(
  //     `${API_BASE}/users/deploy/${action}/`,
  //     { user_id: userId, payment_id: plan.subscription_id },
  //     { headers: { Authorization: `Bearer ${token}` } }
  //   );
  //   navigate(`/lab?user=${userId}`);
  // };

const launchLab = async (plan) => {
  const action = getAction(plan.name);

  if (!action) {
    notify(
      `Lab type not supported for plan: ${plan.name}`,
      "error"
    );
    return;
  }

  try {
    await axios.post(
      `${API_BASE}/users/deploy/${action}/`,
      {
        user_id: userId,
        payment_id: plan.subscription_id,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    notify("Lab launch started", "success");

    navigate(`/lab?user=${userId}`);
  } catch (err) {
    notify("Failed to launch lab", "error");
  }
};

  const handleContinue = (plan) => {
    if (!isActive(plan)) {
      setPopupPlan(plan);
      setShowPopup(true);
      return;
    }
    navigate("/course-preview/3");
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-20">
      <ToastContainer />

      <h1 className="text-4xl font-semibold text-center mb-12">
        My Subscriptions
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.map((p) => {
          const active = isActive(p);

          return (
            <div
              key={p.subscription_id}
              className={`p-6 rounded-2xl border
                ${
                  active
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-red-500/30 bg-red-500/5"
                }`}
            >
              <h3 className="text-lg font-semibold">{p.name}</h3>

              <p className="text-sm text-gray-400 mt-2">
                Price: ₹{p.price}
              </p>
              <p className="text-sm text-gray-400">
                Billing: {p.billing_cycle}
              </p>
              <p className="text-sm text-gray-400">
                Expiry: {new Date(p.expires_at).toLocaleDateString()}
              </p>

              <div className="mt-2 flex justify-between items-center">
                <span
                  className={`text-sm ${
                    active ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  Status: {active ? "Active" : "Expired"}
                </span>

                {!active && (
                  <button
                    onClick={() => {
                      setPopupPlan(p);
                      setShowPopup(true);
                    }}
                    className="px-3 h-7 text-xs rounded-md
                      border border-purple-500/40 text-purple-400"
                  >
                    Upgrade
                  </button>
                )}
              </div>

              <div className="mt-5 space-y-2">
                {active && (
                  <button
                    onClick={() => launchLab(p)}
                    className="w-full h-9 rounded-md text-sm
                      border border-emerald-500/40 text-emerald-400"
                  >
                    Launch Lab
                  </button>
                )}

                <button
                  onClick={() => handleContinue(p)}
                  className="w-full h-9 rounded-md text-sm
                    border border-amber-500/40 text-amber-400"
                >
                  Continue Watching
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== POPUP ===== */}
      {showPopup && popupPlan && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#020617] p-8 rounded-xl border border-purple-500/40 text-center w-full max-w-md">
            <h2 className="text-xl font-semibold mb-3">
              Plan Expired
            </h2>
            <p className="text-gray-400 mb-6">
              Please upgrade <b>{popupPlan.name}</b> to continue.
            </p>

            <div className="flex justify-center gap-4">
              {subscriptions.length > expiredPlans.length && (
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-5 h-9 text-sm rounded-md
                    border border-gray-500/40 text-gray-300"
                >
                  Skip
                </button>
              )}

              <button
                disabled={processing}
                onClick={() => handleUpgrade(popupPlan)}
                className="px-5 h-9 text-sm rounded-md
                  border border-purple-500/40 text-purple-400"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
