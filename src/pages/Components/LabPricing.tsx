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

  const [billingType, setBillingType] = useState("free");
  const [allPackages, setAllPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  /* ================= FETCH PACKAGES ================= */

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);

        const res = await api.get("/api/v1/packages/");

        console.log("API RESPONSE:", res.data);

        const data = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        setAllPackages(data);
      } catch (err) {
        console.error("API ERROR:", err);
        notify("Failed to load packages", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  /* ================= FILTER LABS ================= */

  const labs = useMemo(() => {
    if (!allPackages.length) return [];

    return allPackages
      .filter(
        (pkg) =>
          pkg.billing_cycle?.toLowerCase() === billingType.toLowerCase()
      )
      .map((pkg) => ({
        name: pkg.name || "Unnamed Lab",
        description: pkg.description || "No description available",
        price: pkg.price || 0,
        billing_cycle: pkg.billing_cycle,
        planId: pkg.package_id,
        course_id: pkg.course_id,
        features: [
          "Full Lab Access",
          "SSH Access",
          "Guided Lab Environment",
          "Support Included",
        ],
      }));
  }, [billingType, allPackages]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(labs.length / itemsPerPage);

  const paginatedLabs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return labs.slice(start, start + itemsPerPage);
  }, [labs, currentPage]);

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
      price: lab.price,
      billingType,
      planId: lab.planId,
      course_id: lab.course_id,
    };

    localStorage.setItem("orl_cart", JSON.stringify([item]));

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

  const handleViewCourse = (lab) => {
    if (!lab?.course_id) {
      notify("Course not available", "error");
      return;
    }

    navigate(`/course-preview/${lab.course_id}`);
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
          <div className="flex justify-center min-h-[300px] items-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-blue-400 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* EMPTY STATE */}
            {!labs.length && (
              <p className="text-center text-gray-400 text-lg">
                No labs available for this plan
              </p>
            )}

            {/* CARDS */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedLabs.map((lab, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500 transition"
                >
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {lab.name}
                  </h3>

                  <p className="text-purple-300 mb-6">
                    {lab.description}
                  </p>

                  <div className="text-2xl font-bold text-white mb-6">
                    {billingType === "free" && "Free"}
                    {billingType === "hourly" && `₹${lab.price}/hr`}
                    {billingType === "monthly" && `₹${lab.price}/month`}
                    {billingType === "yearly" && `₹${lab.price}/year`}
                  </div>

                  <ul className="space-y-2 mb-6">
                    {lab.features.map((f, i) => (
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
                      className="w-full py-2 rounded-lg border border-purple-400 text-purple-300 hover:bg-purple-500/10 disabled:opacity-40"
                    >
                      {lab.course_id
                        ? "View Course"
                        : "No Course Available"}
                    </button>

                    <button
                      onClick={() => handlePlanClick(lab)}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold"
                    >
                      {billingType === "free"
                        ? "Start Free Lab"
                        : billingType === "hourly"
                        ? "Start Lab"
                        : "Subscribe"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1 bg-white/10 rounded disabled:opacity-40"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-purple-500 text-white"
                        : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1 bg-white/10 rounded disabled:opacity-40"
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