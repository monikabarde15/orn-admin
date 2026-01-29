// LabPricing.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";

const VIT = import.meta.env.VITE_API_URL;
const API_BASE = `${VIT}/api/v1`;
const ITEMS_PER_PAGE = 5;

const notify = (msg, type = "info") =>
  toast[type](msg, { position: "top-center", autoClose: 2500 });

export default function LabPricing() {
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
  const [instances, setInstances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  /* ================= HELPERS ================= */
  const isActionAllowed = (inst) => inst.status === "Launched";

  /* ================= FETCH ================= */
  const fetchSubscriptions = async () => {
    const res = await axios.get(
      `${API_BASE}/users/subscriptions/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSubscriptions(res.data || []);
  };
const formatDateTime = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

  const fetchInstances = async () => {
    const res = await axios.get(
      `${API_BASE}/lab/userinst/${userId}/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setInstances(res.data || []);
  };

  useEffect(() => {
    fetchSubscriptions();
    fetchInstances();
  }, [token]);

  /* ================= INSTANCE ACTIONS ================= */
  const rebootInstance = async (id) => {
    await axios.post(
      `${API_BASE}/users/reboot/${id}/`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    notify("Reboot started", "success");
  };

  const destroyInstance = async (inst) => {
    try {
      await axios.post(
        `${API_BASE}/users/deploy-free/destroy/`,
        { user_id: userId, user_instance_id: inst.user_instance_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      notify("Instance destroyed successfully", "success");
      fetchInstances();
    } catch (err) {
      notify(err.response?.data?.error || "Destroy failed", "error");
    }
  };

  /* ================= SORT + SEARCH + PAGINATION ================= */

  // 👉 Launched instances top par
  const sortedInstances = [...instances].sort((a, b) => {
    if (a.status === "Launched" && b.status !== "Launched") return -1;
    if (a.status !== "Launched" && b.status === "Launched") return 1;
    return 0;
  });

  const filteredInstances = sortedInstances.filter((i) =>
    (i.instance_name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInstances.length / ITEMS_PER_PAGE);

  const paginatedInstances = filteredInstances.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* ================= RENDER ================= */
  return (
    <>
      <Navbar />
      <ToastContainer />

      <div className="min-h-screen bg-slate-950 px-6 py-20">
        <h1 className="text-4xl font-bold text-white text-center mb-10">
          My Labs
        </h1>

        <div className="max-w-5xl mx-auto bg-white/5 p-6 rounded-xl">
          <input
            className="w-full mb-4 px-3 py-2 rounded bg-white/10 text-white"
            placeholder="Search instance..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />

          {paginatedInstances.map((inst) => (
            <div
              key={inst.user_instance_id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3 p-3 bg-white/5 rounded"
            >
              <div>
                <div className="text-white font-semibold">
                  {inst.instance_name}
                </div>
                <div
                  className={`text-sm ${
                    inst.status === "Launched"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  Status: {inst.status}
                </div>
                <div className="text-xs text-gray-400 mt-1">
              Time: {formatDateTime(inst.rentDate || inst.timestamp)}
            </div>
              </div>
              

              <div className="flex gap-2">
                <button
                  disabled={!isActionAllowed(inst)}
                  onClick={() =>
                    window.open(`/lab`, "_blank")
                  }
                  className="px-3 py-1 bg-blue-600 rounded disabled:opacity-40"
                >
                  WebSSH
                </button>

                <button
                  disabled={!isActionAllowed(inst)}
                  onClick={() =>
                    rebootInstance(inst.user_instance_id)
                  }
                  className="px-3 py-1 bg-yellow-600 rounded disabled:opacity-40"
                >
                  Reboot
                </button>

                <button
                  disabled={!isActionAllowed(inst)}
                  onClick={() => destroyInstance(inst)}
                  className="px-3 py-1 bg-red-600 rounded disabled:opacity-40"
                >
                  Destroy
                </button>
              </div>
            </div>
          ))}

          {/* ===== CLEAN PAGINATION ===== */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2 bg-white/5 px-4 py-2 rounded-lg">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 rounded bg-white/10 disabled:opacity-40"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - page) <= 1
                  )
                  .map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1 rounded ${
                        p === page
                          ? "bg-blue-600 text-white"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 rounded bg-white/10 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
