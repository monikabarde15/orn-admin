import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";
import api from "../../services/api";

const notify = (msg: string, type: "info" | "success" | "error" = "info") => {
  (toast as any)[type](msg, { position: "top-center", autoClose: 2500 });
};

const currencySymbols: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const getCurrencySymbol = (currency?: string | null) => {
  const raw = (currency || "INR").toString().split("-")[0].trim().toUpperCase();
  return currencySymbols[raw] || raw || "₹";
};

const LabPricing = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  const [billingType, setBillingType] = useState<string>("free");
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [allPackages, setAllPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

    const [selectedCurrency, setSelectedCurrency] = useState<string>(
      () => localStorage.getItem("orl_currency") || "INR"
    );

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  /* ================= FETCH PACKAGES ================= */
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);

        // const res = await api.get("/api/v1/packages/");
          const res = await api.get(
  `/api/v1/packages/?currency=${encodeURIComponent(selectedCurrency)}`
);
        const data = Array.isArray(res.data) ? res.data : [];

        setAllPackages(data);
      } catch (err) {
        console.error(err);
        notify("Failed to load packages", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [selectedCurrency]);


    useEffect(() => {
  const handler = () => {
    setSelectedCurrency(localStorage.getItem("orl_currency") || "INR");
  };
  window.addEventListener("orlcurrencychange", handler);
  return () => window.removeEventListener("orlcurrencychange", handler);
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
        // `price` is the base INR amount (used for checkout/payment).
        price: pkg.price,
        // `displayPrice` is the converted UI amount in the selected currency.
        displayPrice: pkg.display_price ?? pkg.price,
        totalMinutes: Number(pkg.total_minutes ?? 0),
        billing_cycle: pkg.billing_cycle,
        planId: pkg.package_id,
        course_id: pkg.course_id, // ✅ ADD THIS
        course_linked: pkg.course_linked, // optional but useful
        currency: pkg.currency ?? "INR",
        freeUsed: Boolean((pkg as any).free_used),
        features: [
          "Cancel any time",
          "SSH Access",
          "Guided Lab Environment",
          "Support Included",
        ],
      });
      }
    }

    return [...map.values()];
  }, [billingType, allPackages]);

  /* ================= MAP DATA (IMPORTANT) ================= */
  // const labs = useMemo<any[]>(() => {
  //   return allPackages
  //     .filter((p: any) => p.billing_cycle === billingType)
  //     .map((p: any) => ({
  //       name: p.name,
  //       description: p.description,
  //       price: p.price ?? 0,
  //       billing_cycle: p.billing_cycle,
  //       planId: p.id,
  //       course_id: p.course_id,
  //       features:
  //         p.features && Array.isArray(p.features) && p.features.length > 0
  //           ? p.features
  //           : [
  //               "Full Lab Access",
  //               "SSH Access",
  //               "Guided Lab Environment",
  //               "Support Included",
  //             ],
  //     }));
  // }, [allPackages, billingType]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(labs.length / itemsPerPage);

  const paginatedLabs = useMemo<any[]>(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return labs.slice(start, start + itemsPerPage);
  }, [labs, currentPage]);

  /* ================= ADD TO CART ================= */
  const addToCart = (lab: any) => {
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
      displayPrice: lab.displayPrice ?? lab.price ?? 0, 
      currency: lab.currency ?? "INR", 
      billingType,
      planId: lab.planId,
      course_id:lab.course_id,
      totalMinutes: Number((lab as any).totalMinutes ?? 0),
      // Frontend will use this to compute scaled price/minutes for hourly.
      hours: billingType === "hourly" ? 1 : undefined,
    };

    localStorage.setItem("orl_cart", JSON.stringify([item]));
    setCartItems([item]);

    notify("Added to cart", "success");

    setTimeout(() => navigate("/cart"), 600);
  };

  const handlePlanClick = (lab: any) => {
    if (!token) {
      notify("Please login to continue", "error");
      navigate("/login");
      return;
    }

    addToCart(lab);
  };

  const handleViewCourse = (lab: any) => {
    if (!lab?.course_id) {
      notify("Course not available for this lab", "error");
      return;
    }

    navigate(`/course-preview/${lab.course_id}`);
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-6">
      <ToastContainer />

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">
            Cancel anytime. Full money-back Guarantee.No risk.
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
              { key: "hourly", label: "Pay per lab" },
            ].map((type) => (
              <button
                key={type.key}
                onClick={() => {
                  setBillingType(type.key);
                  setCurrentPage(1);
                }}
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

        {/* LOADER */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-blue-400 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {paginatedLabs.map((lab, idx) => (

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
                  {billingType === "hourly" && (() => {
                    const totalMinutes = Number((lab as any).totalMinutes ?? 0);
                    const baseHours = totalMinutes > 0 ? totalMinutes / 60 : 1;
                    const hourlyRate = Number(lab.displayPrice ?? lab.price ?? 0) / baseHours;
                    return `${getCurrencySymbol(lab.currency)}${hourlyRate.toFixed(2)}/hr`;
                  })()}
                  {billingType === "monthly" && `${getCurrencySymbol(lab.currency)}${lab.displayPrice}/month`}
                  {billingType === "yearly" && `${getCurrencySymbol(lab.currency)}${lab.displayPrice}/year`}
                </div>

                <ul className="space-y-3 mb-8">
                  {lab.features.map((f: string, i: number) => (
                    <li key={i} className="flex gap-2 text-gray-300">
                      <Check className="w-4 h-4 text-green-400" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleViewCourse(lab)}
                    disabled={!lab.course_id}
                    className={`w-full py-3 rounded-xl border font-semibold transition ${
                      lab.course_id
                        ? "border-purple-400 text-purple-300 hover:bg-purple-500/10"
                        : "border-gray-600 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {lab.course_id ? "View Course" : "No Course Available"}
                  </button>
                  <button
                    onClick={() => handlePlanClick(lab)}
                    disabled={billingType === "free" && lab.freeUsed === true}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {billingType === "free" && (lab.freeUsed ? "Already Used" : "Start Free Lab")}
                    {billingType === "hourly" && "Start Lab"}
                    {(billingType === "monthly" || billingType === "yearly") && "Subscribe"}
                  </button>
                </div>
                </div>
              ))}

            </div>

              {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-16 gap-2 flex-wrap">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 disabled:opacity-40"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    currentPage === i + 1
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : "bg-white/5 border border-white/10 text-gray-400"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
          </>
        )}

      </div>
    </div>
  );
};

export default LabPricing;
