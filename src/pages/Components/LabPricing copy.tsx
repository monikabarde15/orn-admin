// LabPricing.jsx
import React, { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Check } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://dev.backend.onrequestlab.com/api/v1";
const notify = (msg, type = "info") => {
  toast[type](msg, { position: "top-center", autoClose: 2500 });
};

const LabPricing = () => {
  const navigate = useNavigate();

  const [billingTypes, setBillingTypes] = useState([]);
  const [billingType, setBillingType] = useState("hourly");
  const [labs, setLabs] = useState([]);
  const [loadingLabs, setLoadingLabs] = useState(false);
  const [launchingLabId, setLaunchingLabId] = useState(null);
  const [launching, setLaunching] = useState(false);

  const [instances, setInstances] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem("orl_cart");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const pollRef = useRef(null);

  const getCookie = (name) => {
    if (typeof document === "undefined") return "";
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return "";
  };

  const userId = getCookie("user_id");

  let rawToken =
    getCookie("access") ||
    getCookie("jwt-auth") ||
    localStorage.getItem("jwt-auth") ||
    localStorage.getItem("token") ||
    "";

  rawToken = rawToken.replace("Bearer ", "").trim();
  const token = rawToken;

  const user = {
    name: getCookie("username"),
    email: getCookie("email"),
  };

  // ⭐⭐⭐ NEW — store complete package list
  const [allPackages, setAllPackages] = useState([]);

  // First API load
  useEffect(() => {
    const fetchBillingTypes = async () => {
      try {
        const res = await axios.get(`${API_BASE}/packages/`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.data && Array.isArray(res.data)) {
          setAllPackages(res.data); // ⭐ Save full package list

          const uniqueTypes = [
            ...new Set(res.data.map((pkg) => pkg.billing_cycle.toLowerCase())),
          ];

          setBillingTypes(uniqueTypes);

          if (uniqueTypes.length > 0) setBillingType(uniqueTypes[0]);
        }
      } catch (err) {
        console.error("Failed to fetch packages", err);
      }
    };
    fetchBillingTypes();
  }, []);

  // ⭐⭐⭐ NO API CALL ANYMORE — Pure filtering
  const fetchLabsFromApi = async (type = "") => {
    setLoadingLabs(true);

    try {
      const raw = Array.isArray(allPackages) ? allPackages : [];

      const filteredRaw = type
        ? raw.filter(
            (pkg) => pkg.billing_cycle.toLowerCase() === type.toLowerCase()
          )
        : raw;

      const grouped = {};

      filteredRaw.forEach((pkg) => {
        const parts = (pkg.name || "").split("-");
        const baseName = parts[0]?.trim() || pkg.name;
        const subtitle = parts.slice(1).join("-").trim();
        const description = (pkg.description || "")
          .split(";")
          .map((d) => d.trim());

        if (!grouped[baseName]) {
          grouped[baseName] = {
            name: baseName,
            subtitle,
            description,
            monthlyPrice: null,
            monthlyPackageId: null,
            yearlyPrice: null,
            yearlyPackageId: null,
            payAsYouGo: { hourlyRate: null, packageId: null },
            free: { available: false, duration: "" },
            freeFeatures: ["Limited Access for Trial"],
            paidFeatures: ["Full Access", "SSH", "Support"],
            subscription: pkg.subscription || null,
            planId: null,
          };
        }

        const t = grouped[baseName];
        const cycle = (pkg.billing_cycle || "").toLowerCase();

        if (cycle === "monthly") {
          t.monthlyPrice = pkg.price;
          t.monthlyPackageId = pkg.package_id;
        }

        if (cycle === "yearly") {
          t.yearlyPrice = pkg.price;
          t.yearlyPackageId = pkg.package_id;
        }

        if (cycle === "hourly" || cycle === "hour") {
          t.payAsYouGo.hourlyRate = pkg.price;
          t.payAsYouGo.packageId = pkg.package_id;
          t.free.available = true;
          t.free.duration = pkg.free_trial_duration || "Free Trial";
        }

        t.planId =
          t.monthlyPackageId ||
          t.yearlyPackageId ||
          t.payAsYouGo.packageId;
      });

      setLabs(Object.values(grouped));
    } catch (err) {
      console.error(err);
      setLabs([]);
    } finally {
      setLoadingLabs(false);
    }
  };

  // When user switches Hourly / Monthly / Yearly
  useEffect(() => {
    if (billingType && allPackages.length > 0) {
      fetchLabsFromApi(billingType);
    }
  }, [billingType, allPackages]);

  const getCurrentFeatures = (lab) =>
    billingType === "free" ? lab.billing_cycle : lab.paidFeatures;

  const getFreeAction = (labName) => {
    const name = (labName || "").toLowerCase();
    if (name.includes("redhat")) return "redhat";
    if (name.includes("linux")) return "linux";
    if (name.includes("docker")) return "docker";
    if (name.includes("kubernetes") || name.includes("k8s"))
      return "kubernetes";
    if (name.includes("terraform")) return "terraform";
    return "linux";
  };

  const fetchInstances = async () => {
    if (!token || !userId) return;
    try {
      const res = await axios.get(
        `${API_BASE}/lab/userinst/${userId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      let data = res.data || [];
      data.sort((a, b) =>
        a.status === "Launched" && b.status !== "Launched"
          ? -1
          : b.status === "Launched" && a.status !== "Launched"
          ? 1
          : 0
      );
      setInstances(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchInstances();
    const poll = setInterval(fetchInstances, 30000);
    return () => clearInterval(poll);
  }, [token]);

  const launchInstance = async (lab, payment_id = "free") => {
    if (!token || !userId) {
      notify("Please login to continue", "error");
      navigate("/login");
      return false;
    }

    setLaunchingLabId(lab.planId);
    setLaunching(true);

    const beforeIds = instances.map(
      (it) => it.id ?? it.user_instance_id ?? ""
    );

    try {
      const endpoint =
        payment_id === "free"
          ? `${API_BASE}/users/deploy-free/${getFreeAction(
              lab.name
            )}/`
          : `${API_BASE}/users/deploy/${lab.planId}/`;

      const payload = { user_id: userId, action: lab.name };
      if (payment_id !== "free") payload.payment_id = payment_id;

      await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      notify("Launching instance... (this can take a minute)", "info");

      if (pollRef.current) clearInterval(pollRef.current);

      pollRef.current = setInterval(async () => {
        try {
          const res = await axios.get(
            `${API_BASE}/lab/userinst/${userId}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

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
                ? i.is_free ||
                  i.payment_id == null ||
                  i.payment_id === "" ||
                  i.payment_id === "free"
                : i.payment_id === payment_id;

            return isLaunched && (isNew || paymentMatch);
          });

          if (newlyLaunched) {
            clearInterval(pollRef.current);
            pollRef.current = null;
            setLaunchingLabId(null);
            setLaunching(false);
            navigate(`/lab?user=${userId}`);
            notify(
              `Instance launched: ${
                newlyLaunched.instance_ip ||
                newlyLaunched.user_instance_id
              }`,
              "success"
            );
          }
        } catch (err) {}
      }, 1000);

      return true;
    } catch (err) {
      setLaunchingLabId(null);
      setLaunching(false);
      notify("Instance launch failed", "error");
      return false;
    }
  };

  const launchFreeInstance = async (lab) => {
    if (!token) {
      notify("Please login to continue", "error");
      navigate("/login");
      return;
    }

    if (!lab.free || !lab.free.available) {
      notify("Free trial not available for this lab", "error");
      return;
    }

    await launchInstance(lab, "free");
  };

  const handlePlanClick = async (lab) => {
    if (!lab) return;

    if (!token) {
      await addToCart(lab, billingType);
      return;
    }

    if (billingType === "hourly") {
      await launchFreeInstance(lab);
      return;
    }

    await addToCart(lab, billingType);
  };

  const addToCart = (lab, billingType) => {
    if (!lab) return;

    const savedCart = JSON.parse(
      localStorage.getItem("orl_cart") || "[]"
    );
    console.log('savedCart=',savedCart.length);
    if(savedCart.length>0){
      toast.info("You can select only one plan at a time", { autoClose: 2000 });
      return;
    }
    const subscription =
      lab.subscription != null ? lab.subscription : "";

    const price =
      billingType === "monthly"
        ? lab.monthlyPrice
        : billingType === "yearly"
        ? lab.yearlyPrice ?? lab.monthlyPrice
        : 0;

    const exists = savedCart.find(
      (item) =>
        item.planId === lab.planId &&
        item.billingType === billingType
    );

    if (exists) {
      toast.info("Already in cart", { autoClose: 2000 });
      return;
    }

    savedCart.push({
      planId: lab.planId,
      name: lab.name,
      billingType,
      price,
      subscription,
    });

    localStorage.setItem("orl_cart", JSON.stringify(savedCart));
    setCartItems(savedCart);

    toast.success("Added to cart", { autoClose: 2000 });
    setTimeout(() => window.location.reload(), 2500);
  };

  useEffect(() => {
    try {
      localStorage.setItem("orl_cart", JSON.stringify(cartItems));
    } catch (error) {}
  }, [cartItems]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  return (
    <div
      id="courses"
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-6"
    >
      <ToastContainer />

      {/* FULL SCREEN LAUNCHER LOADER */}
      {launching && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent p-8 rounded-xl flex flex-col items-center">
            <div className="loader mb-4"></div>
            <p className="font-semibold text-gray-800">
              Launching your lab, please wait...
            </p>
          </div>
        </div>
      )}

      <style>{`
        .loader {
          border: 4px solid rgba(255, 255, 255, 0.2);
          border-top: 4px solid #8b5cf6;
          border-right: 4px solid #3b82f6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          background: transparent;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent mb-4">
            Simple pricing. No surprise fees.
          </h1>
          <p className="text-gray-400 mt-6 text-xl max-w-2xl mx-auto">
            Choose the perfect lab for your learning journey and start
            practicing today
          </p>
        </div>

        {/* BILLING TOGGLE */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-1">
            {["hourly", "monthly", "yearly"].map((type) => (
              <button
                key={type}
                onClick={() => setBillingType(type)}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  billingType === type
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* LAB CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {labs.map((lab, index) => (
            <div
              key={index}
              className={`relative group transition-all duration-500 hover:-translate-y-2`}
            >
              <div
                className={`relative h-full bg-white/5 backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-300 ${
                  lab.popular
                    ? "border-purple-500/50 shadow-2xl shadow-purple-500/20"
                    : "border-white/10 hover:border-purple-500/30"
                }`}
              >
                <div className="relative p-8">
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {lab.name}
                    </h3>
                    <p className="text-purple-300 text-sm font-medium">
                      {lab.description}
                    </p>
                  </div>

                  <div className="mb-8">
                    {billingType === "monthly" && (
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-bold text-white">
                          ₹{lab.monthlyPrice}
                        </span>
                        <span className="text-gray-400 text-lg">
                          /month
                        </span>
                      </div>
                    )}

                    {billingType === "yearly" && (
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-bold text-white">
                          ₹{lab.yearlyPrice}
                        </span>
                        <span className="text-gray-400 text-lg">
                          /year
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb-8">
                    <p className="text-gray-400 font-medium mb-4 text-sm uppercase tracking-wider">
                      What's included
                    </p>

                    <ul className="space-y-3">
                      {getCurrentFeatures(lab).map(
                        (feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-gray-300 text-sm"
                          >
                            <Check className="w-4 h-4 text-green-400" />
                            {feature}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40"
                      onClick={() => handlePlanClick(lab)}
                      disabled={launchingLabId === lab.planId}
                    >
                      {billingType === "hourly"
                        ? launchingLabId === lab.planId
                          ? "Launching..."
                          : "Start Free Trial"
                        : "Subscribe"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LabPricing;
