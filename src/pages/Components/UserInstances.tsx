// LabPricing.jsx
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";
import api from "../../services/api";

const ITEMS_PER_PAGE = 5;

const notify = (msg, type = "info") =>
  toast[type](msg, { position: "top-center", autoClose: 2500 });

export default function LabPricing() {
  const navigate = useNavigate();

  /* ================= AUTH (NO COOKIES) ================= */
  const token = localStorage.getItem("access_token");
  const userId = localStorage.getItem("userId");
const [SubscriptionLocal, setSubscriptionLocal] = useState<any>(null);
  /* ================= STATE ================= */
  const [subscriptions, setSubscriptions] = useState([]);
  const [instances, setInstances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  /* ================= HELPERS ================= */
  const isActionAllowed = (inst) => inst.status === "Launched";

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

  /* ================= GUARD ================= */
  useEffect(() => {
    if (!token || !userId) {
      notify("Please login first", "error");
      navigate("/login");
    }
  }, []);

  /* ================= FETCH ================= */
  const fetchSubscriptions = async () => {
    try {
      const res = await api.get("/api/v1/users/subscriptions/");
      setSubscriptions(res.data || []);
    } catch (err) {
      notify("Failed to load subscriptions", "error");
    }
  };

  const fetchInstances = async () => {
    try {
      const res = await api.get(`/api/v1/lab/userinst/${userId}/`);
      setInstances(res.data || []);
    } catch (err) {
      notify("Failed to load instances", "error");
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchSubscriptions();
      fetchInstances();
    }
  }, [token, userId]);

  /* ================= INSTANCE ACTIONS ================= */
  const rebootInstance = async (instanceId) => {
    try {
      await api.post(`/api/v1/lab/reboot/${instanceId}/`);
      notify("Reboot started", "success");
    } catch {
      notify("Reboot failed", "error");
    }
  };
useEffect(() => {
  const savedPlan = localStorage.getItem("subscriptionLocal");

  if (savedPlan) {
    const parsedPlan = JSON.parse(savedPlan);
    setSubscriptionLocal(parsedPlan);
  }
}, []);
  const destroyInstance = async (inst) => {
    try {
      await api.post(`/api/v1/lab/deploy/destroy/${packageId}/`, {
        user_id: userId,
        user_instance_id: inst.user_instance_id,
      });

      notify("Instance destroyed successfully", "success");
      fetchInstances();
    } catch (err) {
      notify(err?.response?.data?.error || "Destroy failed", "error");
    }
  };

  /* ================= SORT + SEARCH + PAGINATION ================= */

  // 🔥 launched instances top
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
console.log("Current Plan =", SubscriptionLocal);
const plan = JSON.parse(localStorage.getItem("subscriptionLocal") || "{}");

const packageId = plan.package_id;

console.log("packageId",packageId);
  /* ================= UI ================= */
  return (
    <>
      <Navbar />
      <ToastContainer />

      <div className="min-h-screen bg-slate-950 px-6 py-20">
        <h1 className="text-4xl font-bold text-white text-center mb-10">
          My Labs
        </h1>

        <div className="max-w-5xl mx-auto bg-white/5 p-6 rounded-xl">
          {/* SEARCH */}
          <input
            className="w-full mb-4 px-3 py-2 rounded bg-white/10 text-white"
            placeholder="Search instance..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />

          {/* LIST */}
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
                  onClick={() => window.open(`/lab?user`, "_blank")}
                  className="px-3 py-1 bg-blue-600 rounded disabled:opacity-40"
                >
                  WebSSH
                </button>

                <button
                  disabled={!isActionAllowed(inst)}
                  onClick={() => rebootInstance(inst.user_instance_id)}
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

          {/* PAGINATION */}
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
