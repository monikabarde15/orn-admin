// LabPricing.jsx
import React, { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const notify = (msg, type = "info") =>
  toast[type](msg, { position: "top-center", autoClose: 2500 });

const LabPricing = () => {
  const navigate = useNavigate();

  /* ================= AUTH (NO COOKIES) ================= */
  const token = localStorage.getItem("access_token");
  const userId = localStorage.getItem("userId");

  /* ================= STATE ================= */
  const [billingTypes, setBillingTypes] = useState([]);
  const [billingType, setBillingType] = useState("free");
  const [labs, setLabs] = useState([]);
  const [allPackages, setAllPackages] = useState([]);

  const [launching, setLaunching] = useState(false);
  const [launchingLabId, setLaunchingLabId] = useState(null);
  const [instances, setInstances] = useState([]);

  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("orl_cart") || "[]");
    } catch {
      return [];
    }
  });

  const pollRef = useRef(null);

  /* ================= FETCH PACKAGES ================= */
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get("/api/v1/packages/");
        const data = Array.isArray(res.data) ? res.data : [];

        setAllPackages(data);

        const unique = [
          ...new Set(data.map((p) => p.billing_cycle.toLowerCase())),
        ];
        setBillingTypes(unique);
        if (unique.length) setBillingType(unique[0]);
      } catch (err) {
        console.error("Packages fetch failed", err);
      }
    };

    fetchPackages();
  }, []);

  /* ================= BUILD LAB LIST ================= */
  useEffect(() => {
    if (!billingType || !allPackages.length) return;

    const grouped = {};

    allPackages
      .filter(
        (p) => p.billing_cycle.toLowerCase() === billingType.toLowerCase()
      )
      .forEach((pkg) => {
        const baseName = pkg.name.split("-")[0].trim();

        if (!grouped[baseName]) {
          grouped[baseName] = {
            name: baseName,
            newdescription: pkg.description,
            monthlyPrice: null,
            yearlyPrice: null,
            free: { available: false },
            planId: null,
            paidFeatures: ["Full Access", "SSH", "Support"],
            freeFeatures: ["Limited Access for Trial"],
          };
        }

        if (pkg.billing_cycle === "monthly") {
          grouped[baseName].monthlyPrice = pkg.price;
          grouped[baseName].planId = pkg.package_id;
        }

        if (pkg.billing_cycle === "yearly") {
          grouped[baseName].yearlyPrice = pkg.price;
          grouped[baseName].planId = pkg.package_id;
        }

        if (pkg.billing_cycle === "free") {
          grouped[baseName].free.available = true;
          grouped[baseName].planId = pkg.package_id;
        }
      });

    setLabs(Object.values(grouped));
  }, [billingType, allPackages]);

  /* ================= FEATURES ================= */
  const getCurrentFeatures = (lab) =>
    billingType === "free" ? lab.freeFeatures : lab.paidFeatures;

  /* ================= FETCH INSTANCES ================= */
  const fetchInstances = async () => {
    if (!token || !userId) return;
    try {
      const res = await api.get(`/api/v1/lab/userinst/${userId}/`);
      setInstances(res.data || []);
    } catch {}
  };

  useEffect(() => {
    if (!token) return;
    fetchInstances();
    const poll = setInterval(fetchInstances, 30000);
    return () => clearInterval(poll);
  }, [token]);

  /* ================= CART ================= */
  const addToCart = (lab) => {
    const saved = JSON.parse(localStorage.getItem("orl_cart") || "[]");

    if (saved.length > 0) {
      notify("You can select only one plan at a time", "info");
      return;
    }

    const price =
      billingType === "monthly"
        ? lab.monthlyPrice
        : billingType === "yearly"
        ? lab.yearlyPrice
        : 0;

    saved.push({
      ...lab,
      billingType,
      price,
    });

    localStorage.setItem("orl_cart", JSON.stringify(saved));
    setCartItems(saved);

    notify("Added to cart", "success");
    setTimeout(() => navigate("/cart"), 800);
  };

  const handlePlanClick = (lab) => {
    if (!token) {
      notify("Please login to continue", "error");
      navigate("/login");
      return;
    }
    addToCart(lab);
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-6">
      <ToastContainer />

      {launching && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="text-white text-lg">Launching your lab…</div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">
            Simple pricing. No surprise fees.
          </h2>
          <p className="text-gray-400 mt-6 text-xl">
            Choose the perfect lab and start practicing today
          </p>
        </div>

        {/* BILLING TOGGLE */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white/5 border border-white/10 rounded-xl p-1">
            {["free", "monthly", "yearly"].map((type) => (
              <button
                key={type}
                onClick={() => setBillingType(type)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold ${
                  billingType === type
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "text-gray-400"
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* LAB CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {labs.map((lab, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-3xl font-bold text-white mb-2">
                {lab.name}
              </h3>

              <p className="text-purple-300 mb-6">
                {lab.newdescription}
              </p>

              <div className="text-3xl font-bold text-white mb-6">
                {billingType === "monthly" && `₹${lab.monthlyPrice}/month`}
                {billingType === "yearly" && `₹${lab.yearlyPrice}/year`}
                {billingType === "free" && "Free Trial"}
              </div>

              <ul className="space-y-3 mb-8">
                {getCurrentFeatures(lab).map((f, i) => (
                  <li key={i} className="flex gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-green-400" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanClick(lab)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold"
              >
                {billingType === "free" ? "Start Free Trial" : "Subscribe"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LabPricing;
