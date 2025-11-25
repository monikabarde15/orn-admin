import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "https://dev.backend.onrequestlab.com/api/v1";

const WalletHistory = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get token
  const token =
    localStorage.getItem("jwt-auth") ||
    localStorage.getItem("access") ||
    localStorage.getItem("token") ||
    "";

  const notify = (msg, type = "info") => {
    toast[type](msg, { position: "top-center", autoClose: 3000 });
  };

  useEffect(() => {
    if (!token) {
      notify("Session expired. Please login.", "error");
      return;
    }
    fetchWalletHistory();
  }, [token]);

  const fetchWalletHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/users/subscriptions/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscriptions(res.data || []);
    } catch (err) {
      console.error("Error fetching wallet history:", err);
      notify("Failed to fetch wallet history.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">Wallet / Subscription History</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : subscriptions.length === 0 ? (
        <p className="text-center text-gray-400">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-xl overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Plan Name</th>
                <th className="px-4 py-2 text-left">Amount Paid</th>
                <th className="px-4 py-2 text-left">Billing Cycle</th>
                <th className="px-4 py-2 text-left">Created At</th>
                <th className="px-4 py-2 text-left">Expires At</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub, idx) => (
                <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700 transition">
                  <td className="px-4 py-2">{sub.name || "N/A"}</td>
                  <td className="px-4 py-2">₹{sub.price || "N/A"}</td>
                  <td className="px-4 py-2">{sub.billing_cycle || "N/A"}</td>
                  <td className="px-4 py-2">{sub.created_at ? new Date(sub.created_at).toLocaleString() : "N/A"}</td>
                  <td className="px-4 py-2">{sub.expires_at ? new Date(sub.expires_at).toLocaleString() : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WalletHistory;
