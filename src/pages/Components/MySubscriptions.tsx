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
const normalizeSubscriptions = (data = []) => {
  const map = {};

  data.forEach((p) => {
    const key = p.package_id;

    if (!map[key]) {
      map[key] = p;
    } else {
      // 🔥 same package → latest expiry wins
      if (
        new Date(p.expires_at) >
        new Date(map[key].expires_at)
      ) {
        map[key] = p;
      }
    }
  });

  return Object.values(map);
};

  /* ================= FETCH ================= */
  const fetchSubscriptions = async () => {
    const res = await axios.get(
      `${API_BASE}/users/subscriptions/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // setSubscriptions(res.data || []);
    setSubscriptions(normalizeSubscriptions(res.data || []));

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

    // ✅ CASE 1: Wallet sufficient
    if (remaining === 0) {
      await axios.post(
        `${API_BASE}/users/subscriptions/${plan.subscription_id}/upgrade/`,
        {
          new_package_id: plan.package_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      notify("Plan upgraded successfully", "success");
      setShowPopup(false);
      fetchSubscriptions();
      fetchWallet();
      return;
    }

    // ❌ CASE 2: Wallet low → Razorpay
    notify(`Wallet low, paying ₹${remaining}`, "warning");
    await openRazorpay(remaining);

    // 🔥 FINAL UPGRADE API AFTER PAYMENT
    await axios.post(
      `${API_BASE}/users/subscriptions/${plan.subscription_id}/upgrade/`,
      {
        new_package_id: plan.package_id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    notify("Payment successful & plan upgraded", "success");

    setShowPopup(false);
    fetchSubscriptions();
    fetchWallet();

    setTimeout(() => {
      window.location.reload();
    }, 1000);

  } catch (err) {
    notify("Upgrade failed", "error");
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

   // navigate(`/lab?user=${userId}`);
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
    navigate(`/course-preview/${plan.course_id}`);
  };

  /* ================= UI ================= */
  return (
   <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#020617] to-[#020617] text-white px-6 py-20">
    <ToastContainer />

    <h1 className="text-4xl font-semibold text-center mb-14">
      My Subscriptions
    </h1>

    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
      {subscriptions.map((p) => {
        const active = isActive(p);

        return (
          <div
            key={p.subscription_id}
            className="relative rounded-3xl p-8
              bg-white/5 backdrop-blur-xl
              border border-white/10
              shadow-[0_0_40px_rgba(124,58,237,0.15)]
              hover:scale-[1.02] transition"
          >
            {/* STATUS BADGE */}
            <span
              className={`absolute top-4 right-4 px-3 py-1 text-xs rounded-full
                ${
                  active
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-red-500/15 text-red-400"
                }`}
            >
              {active ? "Active" : "Expired"}
            </span>

            {/* TITLE */}
            <h3 className="text-2xl font-semibold mb-2">
              {p.name}
            </h3>

            <p className="text-sm text-purple-300 mb-6">
              Billing: {p.billing_cycle}
            </p>

            {/* PRICE */}
            <div className="flex items-end gap-1 mb-8">
              <span className="text-4xl font-bold">
                ₹{p.price}
              </span>
              <span className="text-sm text-gray-400 mb-1">
                /{p.billing_cycle}
              </span>
            </div>

            {/* DETAILS */}
            <div className="space-y-2 text-sm text-gray-300 mb-8">
              <p>✔ Full Access</p>
              <p>✔ SSH</p>
              <p>✔ Support</p>
              <p>
                Expiry:{" "}
                {new Date(p.expires_at).toLocaleDateString()}
              </p>
            </div>

            {/* ACTION BUTTONS */}
          <div className="space-y-3">
  {!active && (
    <button
      onClick={() => {
        setPopupPlan(p);
        setShowPopup(true);
      }}
      className="w-full h-11 rounded-xl
        border border-purple-500/40
        text-purple-400 hover:bg-purple-500/10 transition"
    >
      Upgrade Plan
    </button>
  )}

  <button
    onClick={() => handleContinue(p)}
    className="w-full h-11 rounded-xl
      border border-white/20
      text-gray-300 hover:bg-white/10 transition"
  >
    Continue Watching
  </button>
</div>

          </div>
        );
      })}
    </div>

    {/* ===== EXPIRED POPUP ===== */}
    {showPopup && popupPlan && (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-[#020617] p-8 rounded-2xl border border-purple-500/40 text-center w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">
            Plan Expired
          </h2>

          <p className="text-gray-400 mb-6">
            Upgrade <b>{popupPlan.name}</b> to continue using this lab.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowPopup(false)}
              className="px-5 h-10 rounded-lg
                border border-gray-500/40 text-gray-300"
            >
              Cancel
            </button>

            <button
              disabled={processing}
              onClick={() => handleUpgrade(popupPlan)}
              className="px-5 h-10 rounded-lg
                bg-gradient-to-r from-purple-500 to-blue-500
                text-white font-medium"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
}
