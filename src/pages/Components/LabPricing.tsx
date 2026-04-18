import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { courses } from "../../mock/courses";
import React, { useEffect, useState, useMemo } from "react";

const notify = (msg: string, type: "info" | "success" | "error" = "info") => {
  (toast as any)[type](msg, { position: "top-center", autoClose: 2500 });
};

const LabPricing = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");
  const userId = localStorage.getItem("userId");

  const [billingType, setBillingType] = useState<string>("free");

  // No loading needed for mock data
  const [loading] = useState<boolean>(false);

  
  /* ================= PAGINATION ================= */

  const [currentPage, setCurrentPage] = useState<number>(1);

  // For cart state (mock only, not persisted)
  const [cartItems, setCartItems] = useState<any[]>([]);
  const itemsPerPage = 6;

  /* ================= FETCH PACKAGES ================= */

  // No effect needed for mock data
  /* ================= LAB FILTER (FAST) ================= */

  // Use mock courses as labs, grouped by plan
  const labs = useMemo<any[]>(() => {
    return courses
      .filter((c) => c.plan === billingType)
      .map((c) => ({
        name: c.title,
        description: c.description,
        price: c.price ?? (c.duration === 'Free' ? 0 : c.duration),
        billing_cycle: c.plan,
        planId: c.id,
        course_id: c.id,
        course_linked: true,
        features: c.features && Array.isArray(c.features) && c.features.length > 0
          ? c.features
          : [
              "Full Lab Access",
              "SSH Access",
              "Guided Lab Environment",
              "Support Included",
            ],
      }));
  }, [billingType]);

  /* ================= PAGINATION LOGIC ================= */

  const totalPages = Math.ceil(labs.length / itemsPerPage);

  const paginatedLabs = useMemo<any[]>(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return labs.slice(start, start + itemsPerPage);
  }, [labs, currentPage]);

  /* ================= FETCH USER INSTANCES ================= */

  

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
      billingType: billingType,
      planId: lab.planId,
      course_id:lab.course_id,
    };

    const updated = [item];

    localStorage.setItem("orl_cart", JSON.stringify(updated));
    setCartItems(updated);

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
  console.log('lab=', lab);

  if (!lab?.course_id) {
    notify("Course not available for this lab", "error");
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

            <div className="relative">

              <div className="absolute inset-0 blur-xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-40 rounded-full"></div>

              <div className="w-16 h-16 border-4 border-purple-500 border-t-blue-400 rounded-full animate-spin"></div>

            </div>

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
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:opacity-90"
                  >

                    {billingType === "free" && "Start Free Lab"}
                    {billingType === "hourly" && "Start Lab"}
                    {(billingType === "monthly" || billingType === "yearly") &&
                      "Subscribe"}

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