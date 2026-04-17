import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import api from "../../services/api";

const WalletHistory = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token || !userId) {
      toast.error("Please login to view wallet.");
      navigate("/login");
      return;
    }
    fetchWalletTransactions();
  }, [token, userId]);

  const fetchWalletTransactions = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/v1/users/payments/${userId}/`);
      // const res = await api.get(`/api/v1/users/payments/`);
      setPayments(res.data || []);
    } catch {
      toast.error("Failed to fetch wallet transactions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="min-h-screen p-6 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Wallet Transactions</h1>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : payments.length === 0 ? (
          <p className="text-center text-gray-400">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-xl overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Payment ID</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, idx) => (
                  <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700 transition">
                    <td className="px-4 py-2">{p.order_id || "N/A"}</td>
                    <td className="px-4 py-2">{p.payment_id || "N/A"}</td>
                    <td className="px-4 py-2">₹{p.amount ?? "N/A"}</td>
                    <td className="px-4 py-2">{p.status || "N/A"}</td>
                    <td className="px-4 py-2">{p.created_at ? new Date(p.created_at).toLocaleString() : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default WalletHistory;