import React, { useEffect, useState, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const notify = (msg, type = "info") =>
  toast[type](msg, { position: "top-center", autoClose: 2500 });

const LabPricing = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");
  const userId = localStorage.getItem("userId");

  const [billingType, setBillingType] = useState("free");
  const [allPackages, setAllPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [instances, setInstances] = useState([]);

  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("orl_cart")) || [];
    } catch {
      return [];
    }
  });

  /* ================= FETCH PACKAGES ================= */

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const cached = localStorage.getItem("orl_packages");

        if (cached) {
          const parsed = JSON.parse(cached);
          setAllPackages(parsed);
          setLoading(false);
        }

        const res = await api.get("/api/v1/packages/");
        const data = Array.isArray(res.data) ? res.data : [];

        setAllPackages(data);
        localStorage.setItem("orl_packages", JSON.stringify(data));

        setLoading(false);
      } catch (err) {
        console.error("Package fetch error:", err);
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  /* ================= LAB FILTER (FAST) ================= */

  const labs = useMemo(() => {
    if (!allPackages.length) return [];

    const map = new Map();

    for (const pkg of allPackages) {
      if (pkg.billing_cycle !== billingType) continue;

      const baseName = pkg.name.split("-")[0].trim();

      if (!map.has(baseName)) {
        map.set(baseName, {
          name: baseName,
          description: pkg.description,
          price: pkg.price,
          billing_cycle: pkg.billing_cycle,
          planId: pkg.package_id,
          features: [
            "Full Lab Access",
            "SSH Access",
            "Guided Lab Environment",
            "Support Included",
          ],
        });
      }
    }

    return [...map.values()];
  }, [billingType, allPackages]);

  /* ================= FETCH USER INSTANCES ================= */

  useEffect(() => {
    if (!token || !userId) return;

    const fetchInstances = async () => {
      try {
        const res = await api.get(`/api/v1/lab/userinst/${userId}/`);
        setInstances(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInstances();

    const poll = setInterval(fetchInstances, 30000);
    return () => clearInterval(poll);
  }, [token, userId]);

  /* ================= ADD TO CART ================= */

  const addToCart = (lab) => {
  const saved = JSON.parse(localStorage.getItem("orl_cart") || "[]");

  if (saved.length > 0) {
    notify("You can select only one plan at a time", "info");
    return;
  }

  const item = {
    name: lab.name,
    description: lab.description,
    features: lab.features,
    price: lab.price || 0,
    billingType: billingType,
    planId: lab.planId
  };

  const updated = [item];

  localStorage.setItem("orl_cart", JSON.stringify(updated));
  setCartItems(updated);

  notify("Added to cart", "success");

  setTimeout(() => navigate("/cart"), 600);
};

  const handlePlanClick = (lab) => {
    if (!token) {
      notify("Please login to continue", "error");
      navigate("/login");
      return;
    }

    addToCart(lab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-6">
      <ToastContainer />

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

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

            {[
              { key: "free", label: "Free" },
              { key: "monthly", label: "Monthly" },
              { key: "yearly", label: "Yearly" },
              { key: "hourly", label: "Pay as you go" },
            ].map((type) => (
              <button
                key={type.key}
                onClick={() => setBillingType(type.key)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition ${
                  billingType === type.key
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {type.label}
              </button>
            ))}

          </div>
        </div>

        {/* LAB CARDS */}

        {loading ? (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-white/5 animate-pulse"
              />
            ))}
          </div>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {labs.map((lab, idx) => (

              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500 transition"
              >

                <h3 className="text-3xl font-bold text-white mb-2">
                  {lab.name}
                </h3>

                <p className="text-purple-300 mb-6">
                  {lab.description}
                </p>

                <div className="text-3xl font-bold text-white mb-6">

                  {billingType === "free" && "Free"}
                  {billingType === "hourly" && `₹${lab.price}/hr`}
                  {billingType === "monthly" && `₹${lab.price}/month`}
                  {billingType === "yearly" && `₹${lab.price}/year`}

                </div>

                <ul className="space-y-3 mb-8">

                  {lab.features.map((f, i) => (
                    <li key={i} className="flex gap-2 text-gray-300">
                      <Check className="w-4 h-4 text-green-400" />
                      {f}
                    </li>
                  ))}

                </ul>

                <button
                  onClick={() => handlePlanClick(lab)}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:opacity-90"
                >

                  {billingType === "free" && "Start Free Lab"}
                  {billingType === "hourly" && "Start Lab"}
                  {(billingType === "monthly" || billingType === "yearly") &&
                    "Subscribe"}

                </button>

              </div>

            ))}

          </div>

        )}

      </div>
    </div>
  );
};

export default LabPricing;