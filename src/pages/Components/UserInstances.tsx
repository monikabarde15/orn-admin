// LabPricing.jsx
import React, { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Check, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";

const API_BASE = "https://dev.backend.onrequestlab.com/api/v1";
const notify = (msg, type = "info") => {
  toast[type](msg, { position: "top-center", autoClose: 2500 });
};

const LabPricing = () => {
  const navigate = useNavigate();
  const [billingType, setBillingType] = useState("monthly");
  const [instances, setInstances] = useState([]);
  const [loadingInstances, setLoadingInstances] = useState(false);
  const [launchingInstance, setLaunchingInstance] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem("orl_cart");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [webSSHUrl, setWebSSHUrl] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [walletButtonError, setWalletButtonError] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [useWallet, setUseWallet] = useState(false);
  const pollRef = useRef(null);

  // Pagination + Search
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Cookies / tokens
  const getCookie = (name) => {
    if (typeof document === "undefined") return "";
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return "";
  };
  const tokenFromCookie = getCookie("access");
  const userId = getCookie("user_id");
  const tokenFromStorage =
    localStorage.getItem("jwt-auth") ||
    localStorage.getItem("access") ||
    localStorage.getItem("token") ||
    "";
  const token = (tokenFromCookie || tokenFromStorage || "").trim();
  const user = { name: getCookie("username"), email: getCookie("email") };

  // Sample labs
  const allLabs = [
    "Linux System Administration",
    "Docker Container Management",
    "Kubernetes Orchestration",
    "Terraform Infrastructure as Code",
    "Python",
  ];

  // Filter + Pagination
  const filteredInstances = instances.filter((inst) =>
    (inst.instance_name || inst.user_instance_id || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredInstances.length / itemsPerPage);
  const currentInstances = filteredInstances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ------- Wallet fetch -------
  const fetchWalletBalance = async () => {
    setLoadingWallet(true);
    try {
      const res = await axios.get(`${API_BASE}/users/wallet/balance/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bal = res.data?.balance ?? res.data?.wallet_amount ?? res.data;
      setWalletBalance(typeof bal === "object" ? bal.balance ?? null : bal);
    } catch (err) {
      setWalletBalance(null);
    } finally {
      setLoadingWallet(false);
    }
  };

  useEffect(() => {
    if (token) fetchWalletBalance();
  }, [token]);

  // ------- Fetch instances -------
  const fetchInstances = async () => {
    if (!token || !userId) return;
    setLoadingInstances(true);
    try {
      const res = await axios.get(`${API_BASE}/lab/userinst/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let data = res.data || [];
      data.sort((a, b) =>
        a.status === "Launched" && b.status !== "Launched"
          ? -1
          : b.status === "Launched" && a.status !== "Launched"
          ? 1
          : 0
      );
      setInstances(data);
      const launched = data.find((i) => i.status === "Launched");
      if (launched) setWebSSHUrl(launched.webssh_url || null);
      else setWebSSHUrl(null);
    } catch (err) {}
    finally { setLoadingInstances(false); }
  };

  useEffect(() => {
    if (!token) return;
    fetchInstances();
    const poll = setInterval(fetchInstances, 30000);
    return () => clearInterval(poll);
  }, [token]);

  // ------- Launch Instance -------
  const launchInstance = async (lab, payment_id = "free") => {
    if (!token || !userId) {
      notify("Please login to continue", "error");
      navigate("/login");
      return false;
    }
    setLaunchingInstance(true);
    const beforeIds = instances.map((it) => it.id ?? it.user_instance_id ?? "");
    try {
      const endpoint =
        payment_id === "free"
          ? `${API_BASE}/users/deploy-free/${lab.name.toLowerCase()}/`
          : `${API_BASE}/users/deploy/${lab.planId}/`;
      const payload = { user_id: userId, action: lab.name };
      if (payment_id !== "free") payload.payment_id = payment_id;
      await axios.post(endpoint, payload, { headers: { Authorization: `Bearer ${token}` } });
      notify("Launching instance... (this can take a minute)", "info");

      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(async () => {
        try {
          const res = await axios.get(`${API_BASE}/lab/userinst/${userId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const latest = res.data || [];
          latest.sort((a, b) =>
            a.status === "Launched" && b.status !== "Launched"
              ? -1
              : b.status === "Launched" && a.status !== "Launched"
              ? 1
              : 0
          );
          setInstances(latest);

          const newlyLaunched = latest.find((i) => {
            const iid = i.id ?? i.user_instance_id ?? "";
            const isLaunched = i.status === "Launched";
            const isNew = !beforeIds.includes(iid);
            const paymentMatch =
              payment_id === "free"
                ? (i.is_free || i.payment_id == null || i.payment_id === "" || i.payment_id === "free")
                : i.payment_id === payment_id;
            return isLaunched && (isNew || paymentMatch);
          });

          if (newlyLaunched) {
            clearInterval(pollRef.current);
            pollRef.current = null;
            setLaunchingInstance(false);
            const url = newlyLaunched.webssh_url;
            if (url) window.open(url, "_blank");
            notify(`Instance launched: ${newlyLaunched.instance_ip || newlyLaunched.user_instance_id}`, "success");
          }
        } catch (err) {}
      }, 3000);
      return true;
    } catch (err) {
      setLaunchingInstance(false);
      notify("Instance launch failed", "error");
      return false;
    }
  };

  const copyToClipboard = (text) => {
    if (!navigator.clipboard) return notify("Clipboard not available", "error");
    navigator.clipboard.writeText(text);
    notify("Copied to clipboard", "success");
  };

  const rebootInstance = async (id) => {
    if (!token) { notify("Please login", "error"); return; }
    if (!window.confirm("Are you sure you want to reboot this instance?")) return;
    try {
      await axios.post(`${API_BASE}/users/reboot/${id}/`, {}, { headers: { Authorization: `Bearer ${token}` } });
      notify("Reboot initiated!", "success");
    } catch (err) { notify("Failed to reboot instance", "error"); }
  };

  const destroyInstance = async (instance) => {
    if (!token) { notify("Please login", "error"); return; }
    if (!window.confirm("Are you sure to destroy this instance?")) return;
    try {
      if (!instance.payment_id) {
        await axios.post(`${API_BASE}/users/deploy-free/destroy/`, { user_id: instance.user_instance_id }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${API_BASE}/users/deploy-experimental/destroy/`, { user_id: instance.user_instance_id }, { headers: { Authorization: `Bearer ${token}` } });
      }
      notify("Destroy request sent", "success");
      setTimeout(fetchInstances, 3000);
    } catch (err) { notify("Failed to destroy instance", "error"); }
  };

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-6">
        <ToastContainer />
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent mb-4">
            My Instances
          </h1>
        </div>

        {/* Instances Panel */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
              <h3 className="text-white font-bold">Your Instances</h3>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Search instance..."
                  className="px-3 py-1 rounded bg-white/10 text-white placeholder-gray-400 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="text-sm text-gray-400">
                  {loadingInstances ? "Refreshing..." : `${filteredInstances.length} item(s)`}
                </div>
              </div>
            </div>

            {filteredInstances.length === 0 ? (
              <div className="text-gray-400">No instances match your search.</div>
            ) : (
              <>
                <ul className="space-y-3">
                  {currentInstances.map((inst, i) => (
                    <li
                      key={i}
                      className="bg-white/5 p-3 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="text-white font-semibold">
                          {inst.instance_name || inst.user_instance_id || `Instance ${i + 1}`}
                        </div>
                        <div className="text-gray-400 text-sm">
                          Status: {inst.status} {inst.is_free ? "(Free)" : ""}
                        </div>
                        {inst.instance_ip && (
                          <div className="text-gray-400 text-sm">IP: {inst.instance_ip}</div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                        {inst.instance_ip && (
                          <button
                            className="px-3 py-1 bg-gray-800 rounded text-white text-sm"
                            onClick={() => copyToClipboard(inst.instance_ip)}
                          >
                            Copy IP
                          </button>
                        )}
                        {inst.status === "Launched" && (
                          <button
                            className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded text-white text-sm"
                            onClick={() =>
                              window.open(`/lab?user=${inst.userId}`, "_blank")
                            }
                          >
                            WebSSH
                          </button>
                        )}
                        <button
                          className="px-3 py-1 bg-yellow-600 rounded text-white text-sm"
                          onClick={() => rebootInstance(inst.user_instance_id)}
                        >
                          Reboot
                        </button>
                        <button
                          className="px-3 py-1 bg-red-700 rounded text-white text-sm"
                          onClick={() => destroyInstance(inst)}
                        >
                          Destroy
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-4 flex-wrap">
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                    <button
                      key={p}
                      className={`px-3 py-1 rounded ${currentPage === p ? "bg-blue-600 text-white" : "bg-white/5 text-gray-300"}`}
                      onClick={() => setCurrentPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LabPricing;
