// LabPricing.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";

const API_BASE = "https://dev.backend.onrequestlab.com/api/v1";
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
  const [launching, setLaunching] = useState(false);
  const [showInstances, setShowInstances] = useState(false);

  const [expiredQueue, setExpiredQueue] = useState([]);
  const [currentExpired, setCurrentExpired] = useState(null);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  /* ================= HELPERS ================= */
  const isPlanActive = (plan) =>
    plan.expires_at && new Date(plan.expires_at) > new Date();

  const getActionByPackageName = (name) => {
    if (!name) return "";
    const n = name.toLowerCase();
    if (n.includes("docker")) return "docker";
    if (n.includes("kubernetes")) return "kubernetes";
    if (n.includes("linux")) return "linux";
    if (n.includes("terraform")) return "iscsi";
    if (n.includes("python")) return "python";
    if (n.includes("jenkins")) return "jenkins";
    return "";
  };

  const copyText = (label, value) => {
    if (!value) return notify(`${label} not available`, "error");
    navigator.clipboard.writeText(value);
    notify(`${label} copied`, "success");
  };

  /* ================= FETCH ================= */
  const fetchSubscriptions = async () => {
    const res = await axios.get(
      `${API_BASE}/users/subscriptions/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSubscriptions(res.data || []);
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

  /* ================= EXPIRED PLAN QUEUE ================= */
  useEffect(() => {
    if (!subscriptions.length) return;
    const expired = subscriptions.filter((p) => !isPlanActive(p));
    if (expired.length) {
      setExpiredQueue(expired);
      setCurrentExpired(expired[0]);
      setShowUpgradePopup(true);
    }
  }, [subscriptions]);

  const skipCurrentPlan = () => {
    const rest = expiredQueue.slice(1);
    if (rest.length) {
      setExpiredQueue(rest);
      setCurrentExpired(rest[0]);
    } else {
      setShowUpgradePopup(false);
      setCurrentExpired(null);
    }
  };

  /* ================= LAUNCH ================= */
  const launchInstance = async (plan) => {
    if (!isPlanActive(plan)) {
      notify("Please upgrade plan first", "warning");
      return;
    }

    setLaunching(true);
    const action = getActionByPackageName(plan.name);

    try {
      await axios.post(
        `${API_BASE}/users/deploy/${action}/`,
        { user_id: userId, action, payment_id: plan.subscription_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/lab?user=${userId}`);
    } catch {
      notify("Launch failed", "error");
    } finally {
      setLaunching(false);
    }
  };

  const upgradeAndLaunch = async () => {
    notify("Payment successful. Plan upgraded.", "success");
    await fetchSubscriptions();
    if (currentExpired) await launchInstance(currentExpired);
    skipCurrentPlan();
  };

  /* ================= INSTANCE ACTIONS ================= */
  const isActionAllowed = (inst) => inst.status === "Launched";

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

  /* ================= SEARCH + PAGINATION ================= */
  const filteredInstances = instances.filter((i) =>
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

              

        {/* ===== INSTANCE LIST ===== */}
          <div className="max-w-5xl mx-auto bg-white/5 p-6 rounded-xl">
            <input
              className="w-full mb-4 px-3 py-2 rounded bg-white/10 text-white"
              placeholder="Search instance..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {paginatedInstances.map((inst) => (
              <div
                key={inst.user_instance_id}
                className="flex justify-between items-center mb-3 p-3 bg-white/5 rounded"
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
                </div>

                <div className="flex gap-2">
                  <button
                    disabled={!isActionAllowed(inst)}
                    onClick={() =>
                      window.open(`/lab?user=${inst.userId}`, "_blank")
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

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1 rounded ${
                        p === page
                          ? "bg-blue-600"
                          : "bg-white/10"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
      </div>

     
      <Footer />
    </>
  );
}
