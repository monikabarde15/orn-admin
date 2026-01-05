import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Check } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "https://dev.backend.onrequestlab.com/api/v1";

const notify = (msg, type = "info") => {
  toast[type](msg, { position: "top-center", autoClose: 2500 });
};

const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  /* ================= TOKEN ================= */

  const getCookie = (name) => {
    if (typeof document === "undefined") return "";
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return "";
  };

  let token =
    getCookie("access") ||
    getCookie("jwt-auth") ||
    localStorage.getItem("jwt-auth") ||
    localStorage.getItem("token") ||
    "";

  token = token.replace("Bearer ", "").trim();

  /* ================= FETCH API ================= */

  const fetchSubscriptions = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/users/subscriptions/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubscriptions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      notify("Failed to fetch subscriptions", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  /* ================= SEARCH ================= */

  const searchedData = subscriptions.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-6">
      <ToastContainer />
{/* TOP ACTION BUTTONS */}
<div className="flex justify-center gap-4 mb-12">
  <button
    onClick={() => window.location.href = "/your-instances"}
    className="px-6 py-2.5 rounded-full text-sm font-semibold
               bg-gradient-to-r from-indigo-500 to-purple-500
               text-white shadow-md shadow-purple-500/30
               hover:scale-105 transition-all duration-200"
  >
    My Labs
  </button>

  <button
    onClick={() => window.location.href = "/courses-list"}
    className="px-6 py-2.5 rounded-full text-sm font-semibold
               bg-gradient-to-r from-emerald-500 to-teal-500
               text-white shadow-md shadow-emerald-500/30
               hover:scale-105 transition-all duration-200"
  >
    My Courses
  </button>
</div>

      <div className="max-w-7xl mx-auto">
        {/* TITLE */}
        
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">
            My Subscriptions
          </h1>
          <p className="text-gray-400 mt-4 text-lg">
            Your active subscription plans
          </p>
        </div>

        {/* SEARCH */}
        <div className="max-w-xl mx-auto mb-12">
          <input
            type="text"
            placeholder="Search subscription..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-400">Loading...</p>
        )}

        {/* EMPTY */}
        {!loading && searchedData.length === 0 && (
          <p className="text-center text-gray-400">
            No subscriptions found
          </p>
        )}

        {/* ✅ CARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {searchedData.map((sub) => (
            <div
              key={sub.subscription_id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-purple-500/40 transition"
            >
              {/* NAME */}
              <h3 className="text-3xl font-bold text-white mb-2">
                {sub.name}
              </h3>

              <p className="text-purple-300 text-sm mb-6 capitalize">
                {sub.billing_cycle} plan
              </p>

              {/* PRICE */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-white">
                  ₹{sub.price}
                </span>
                <span className="text-gray-400 text-lg">
                  /{sub.billing_cycle}
                </span>
              </div>

              {/* DETAILS */}
              <p className="text-gray-400 font-medium mb-4 text-sm uppercase tracking-wider">
                Subscription Details
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  Started: {new Date(sub.created_at).toLocaleDateString()}
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  Expires: {new Date(sub.expires_at).toLocaleDateString()}
                </li>
              </ul>

              {/* BUTTON */}
              <button
                disabled
                className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 text-white opacity-80 cursor-not-allowed"
              >
                Active Subscription
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MySubscriptions;
