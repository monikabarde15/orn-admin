import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../services/api";

const notify = (msg: string, type: "info" | "success" | "error" | "warning" = "info") =>
  toast[type](msg, { position: "top-center", autoClose: 2500 });

const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

const isActive = (p: any) =>
  p.expires_at && new Date(p.expires_at) > new Date();

export default function MySubscriptions() {
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");
  const userId = localStorage.getItem("userId");

  const [SubscriptionLocal, setSubscriptionLocal] = useState<any>(null);

  /* ---------- STATE ---------- */
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [wallet, setWallet] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const [popupPlan, setPopupPlan] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);

  const [processing, setProcessing] = useState(false);

  /* ---------- AUTH CHECK ---------- */
  useEffect(() => {
    if (!token || !userId) {
      notify("Please login first", "error");
      navigate("/login");
    }
  }, []);

  /* ---------- NORMALIZE ---------- */
  const normalizeSubscriptions = (data: any[] = []) => {
    const map: any = {};

    data.forEach((p) => {
      const key = p.package_id;
      if (!map[key]) {
        map[key] = p;
      } else if (
        new Date(p.expires_at) > new Date(map[key].expires_at)
      ) {
        map[key] = p;
      }
    });

    return Object.values(map);
  };

  /* ---------- FETCH ---------- */

  const fetchSubscriptions = async () => {
    const res = await api.get("/api/v1/users/subscriptions/");
    setSubscriptions(normalizeSubscriptions(res.data || []));
  };

  const fetchWallet = async () => {
    const res = await api.get("/api/v1/users/wallet/balance/");
    setWallet(res.data?.balance ?? 0);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchSubscriptions(), fetchWallet()]);
      } catch {
        notify("Failed to load subscriptions", "error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ---------- EXPIRED POPUP ---------- */

  useEffect(() => {
    if (!subscriptions.length) return;

    const expired = subscriptions.filter((p) => !isActive(p));
    if (expired.length > 0) {
      setPopupPlan(expired[0]);
      setShowPopup(true);
    }
  }, [subscriptions]);

  /* ---------- LOCAL PLAN ---------- */

  useEffect(() => {
    const savedPlan = localStorage.getItem("subscriptionLocal");

    if (savedPlan) {
      const parsedPlan = JSON.parse(savedPlan);
      setSubscriptionLocal(parsedPlan);
    }
  }, []);
const handleUpgrade = async () => {
  try {
    setProcessing(true);

    const token = localStorage.getItem("access_token");

    const res = await api.post(
      `/api/v1/users/subscriptions/${popupPlan.subscription_id}/upgrade/`,
      {
        new_package_id: popupPlan.package_id, // ya selected upgrade plan id
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    notify("Plan upgraded successfully", "success");

    setShowPopup(false);

    // refresh data
    await fetchSubscriptions();
    await fetchWallet();

  } catch (error: any) {
    console.log(error);
    notify(error?.response?.data?.message || "Upgrade failed", "error");
  } finally {
    setProcessing(false);
  }
};
  const handleContinue = (plan: any) => {
    const existingPlan = JSON.parse(localStorage.getItem("subscriptionLocal") || "{}");

    if (existingPlan.package_id !== plan.package_id) {
      localStorage.removeItem("subscriptionLocal");
      localStorage.setItem("subscriptionLocal", JSON.stringify(plan));
      setSubscriptionLocal(plan);
    }

    if (!isActive(plan)) {
      setPopupPlan(plan);
      setShowPopup(true);
      return;
    }

    navigate(`/course-preview/${plan.course_id}/${plan.package_id}`);
  };

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-20">
      <ToastContainer />

      <h1 className="text-4xl font-semibold text-center mb-14">
        My Subscriptions
      </h1>

      {/* 🔵 LOADER */}
      {loading ? (

        <div className="flex justify-center items-center h-[300px]">
          <div className="w-14 h-14 border-4 border-[#7b4dff] border-t-transparent rounded-full animate-spin"></div>
        </div>

      ) : (

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">

          {subscriptions.map((p) => {
            const active = isActive(p);

            return (
              <div
                key={p.subscription_id}
                className="relative rounded-3xl p-8 
                bg-white/5 border border-white/10 
                hover:border-purple-500/70
                hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]
                backdrop-blur-xl 
                hover:scale-[1.02] transition-all duration-300"
              >

                <span
                  className={`absolute top-4 right-4 px-3 py-1 text-xs rounded-full ${
                    active
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {active ? "Active" : "Expired"}
                </span>

                <h3 className="text-2xl font-semibold mb-2">{p.name}</h3>

                <p className="text-sm text-purple-300">
                  Billing: {p.billing_cycle}
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  Expiry Date:
                  <span className="text-gray-200 font-medium ml-1">
                    {formatDate(p.expires_at)}
                  </span>
                </p>

                <div className="text-4xl font-bold my-6">₹{p.price}</div>

                <div className="space-y-3">

                  {!active && (
                    <button
                      onClick={() => {
                        setPopupPlan(p);
                        setShowPopup(true);
                      }}
                      className="w-full h-11 rounded-xl border border-purple-500/40 text-purple-400 hover:bg-purple-500/10"
                    >
                      Upgrade Plan
                    </button>
                  )}

                  <button
                    onClick={() => handleContinue(p)}
                    className="w-full h-11 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10"
                  >
                    Continue Watching
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* -------- EXPIRED POPUP -------- */}

      {showPopup && popupPlan && (

        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="bg-[#020617] p-8 rounded-2xl border border-purple-500/40 text-center w-full max-w-md">

            <h2 className="text-2xl font-semibold mb-2 text-red-400">
              Plan Expired
            </h2>

            <p className="text-gray-300 mb-2">
              <b>{popupPlan.name}</b> expired on
            </p>

            <p className="text-purple-300 mb-6">
              {formatDate(popupPlan.expires_at)}
            </p>

            <div className="flex justify-center gap-4">

              <button
                onClick={() => setShowPopup(false)}
                className="px-5 h-10 rounded-lg border border-gray-500/40 text-gray-300"
              >
                Skip
              </button>
            <button
              onClick={handleUpgrade}
              disabled={processing}
              className="px-5 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white"
            >
              {processing ? "Processing..." : "Upgrade Now"}
            </button>
              

            </div>

          </div>

        </div>

      )}

    </div>
  );
}