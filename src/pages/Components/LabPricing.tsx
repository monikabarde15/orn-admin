// LabPricing.jsx
import React, { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Check, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://backend.onrequestlab.com/api/v1";
const notify = (msg, type = "info") => {
  // toast types: info, success, error, warning
  toast[type](msg, { position: "top-center", autoClose: 2500 });
};

const LabPricing = () => {
  const navigate = useNavigate();

  // UI state
  const [billingType, setBillingType] = useState("monthly");
  const [showLabListModal, setShowLabListModal] = useState(false);

  // Payment popup states
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [useWallet, setUseWallet] = useState(false);

  // Wallet balance
  const [walletBalance, setWalletBalance] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [walletButtonError, setWalletButtonError] = useState(false);

  // Instance & payments state
  const [launchingInstance, setLaunchingInstance] = useState(false);
  const [instances, setInstances] = useState([]);
  const [payments, setPayments] = useState([]);
  const [webSSHUrl, setWebSSHUrl] = useState(null);
  const [loadingInstances, setLoadingInstances] = useState(false);

  // Local cart (UI) - stored in localStorage for temporary cart until checkout
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem("orl_cart");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [showCartModal, setShowCartModal] = useState(false);

  // refs for polling and previous instance snapshot
  const pollRef = useRef(null);

  // Token helpers (existing)
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

  const user = {
    name: getCookie("username"),
    email: getCookie("email"),
  };

  // sample labs
  const allLabs = [
    "Linux System Administration",
    "Docker Container Management",
    "Kubernetes Orchestration",
    "Terraform Infrastructure as Code",
    "Python",
  ];

  const labs = [
    {
      planId: 1,
      name: "Redhat Cluster",
      subtitle: "5 VMs",
      monthlyPrice: 5000,
      yearlyPrice: 15000,
      payAsYouGo: { walletAmount: 15000, hourlyRate: 100 },
      free: { available: true, duration: "7 days trial" },
      freeFeatures: [
        "Limited Access Lab (60 mins)",
        "No real-time project environments",
        "Read-only access to blogs and tutorials",
        "Community Support",
      ],
      paidFeatures: ["Full Cluster Access", "5 Virtual Machines", "24/7 Availability", "Technical Support"],
      popular: true,
    },
    {
      planId: 2,
      name: "Linux",
      subtitle: "2 Node Setup",
      monthlyPrice: 500,
      yearlyPrice: 4000,
      payAsYouGo: { walletAmount: 4000, hourlyRate: 30 },
      free: { available: true, duration: "14 days trial" },
      freeFeatures: [
        "Limited Access Lab (60 mins)",
        "No real-time project environments",
        "Read-only access to blogs and tutorials",
        "Community Support",
      ],
      paidFeatures: ["2 Node Configuration", "SSH Access", "Basic Support", { text: "List of Lab Access", hasModal: true }],
      popular: false,
    },
    {
      planId: 3,
      name: "Docker",
      subtitle: "Container Platform",
      monthlyPrice: 500,
      yearlyPrice: 4000,
      payAsYouGo: { walletAmount: 4000, hourlyRate: 30 },
      free: { available: true, duration: "14 days trial" },
      freeFeatures: [
        "Limited Access Lab (60 mins)",
        "No real-time project environments",
        "Read-only access to blogs and tutorials",
        "Community Support",
      ],
      paidFeatures: [
        "Docker Environment",
        "Container Management",
        "Image Registry Access",
        "Documentation Included",
        { text: "List of Lab Access", hasModal: true },
      ],
      popular: false,
    },
    {
      planId: 4,
      name: "Kubernetes",
      subtitle: "Orchestration Lab",
      monthlyPrice: 500,
      yearlyPrice: 4000,
      payAsYouGo: { walletAmount: 4000, hourlyRate: 30 },
      free: { available: true, duration: "14 days trial" },
      freeFeatures: [
        "Limited Access Lab (60 mins)",
        "No real-time project environments",
        "Read-only access to blogs and tutorials",
        "Community Support",
      ],
      paidFeatures: [
        "K8s Cluster",
        "Kubectl Access",
        "Helm Charts",
        "Load Balancing",
        { text: "List of Lab Access", hasModal: true },
      ],
      popular: false,
    },
    {
      planId: 5,
      name: "Terraform",
      subtitle: "IaC Platform",
      monthlyPrice: 500,
      yearlyPrice: 4000,
      payAsYouGo: { walletAmount: 4000, hourlyRate: 30 },
      free: { available: true, duration: "14 days trial" },
      freeFeatures: [
        "Limited Access Lab (60 mins)",
        "No real-time project environments",
        "Read-only access to blogs and tutorials",
        "Community Support",
      ],
      paidFeatures: ["Terraform Setup", "State Management", "Multiple Providers", "Best Practices Guide", { text: "List of Lab Access", hasModal: true }],
      popular: false,
    },
  ];

  const getCurrentFeatures = (lab) => (billingType === "free" ? lab.freeFeatures : lab.paidFeatures);
const price = useEffect(() => {
    const handleStorageChange = () => {
        const savedCart = JSON.parse(localStorage.getItem("orl_cart") || "[]");
        setCartItems(savedCart);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);

    if (!token) return;
    fetchWalletBalance();
}, [token]);

  // ------- Wallet balance fetch -------
 useEffect(() => {
  const handleStorageChange = () => {
    const savedCart = JSON.parse(localStorage.getItem("orl_cart") || "[]");
    setCartItems(savedCart);
  };

  window.addEventListener("storage", handleStorageChange);

  if (token) {
    fetchWalletBalance();
  }

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, [token]);


  const fetchWalletBalance = async () => {
    setLoadingWallet(true);
    try {
      const res = await axios.get(`${API_BASE}/users/wallet/balance/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bal = res.data?.balance ?? res.data?.wallet_amount ?? res.data;
      setWalletBalance(typeof bal === "object" ? bal.balance ?? null : bal);
    } catch (err) {
      console.warn("Wallet balance fetch failed:", err?.response?.data ?? err.message ?? err);
      setWalletBalance(null);
    } finally {
      setLoadingWallet(false);
    }
  };

  // ------- Razorpay script loader -------
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (typeof document === "undefined") return resolve(false);
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // ------- Backend calls -------
  const createOrderOnBackend = async (amount) => {
    try {
      const res = await axios.post(
        `${API_BASE}/users/create-order/`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      console.error("createOrderOnBackend error:", err?.response?.data ?? err);
      return null;
    }
  };

  const verifyPaymentOnBackend = async (payload) => {
    try {
      const res = await axios.post(`${API_BASE}/users/verify-payment/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error("verifyPaymentOnBackend error:", err?.response?.data ?? err);
      return null;
    }
  };

  const createSubscriptionOnBackend = async (planId) => {
    try {
      const res = await axios.post(`${API_BASE}/users/subscriptions/create/${planId}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error("createSubscriptionOnBackend error:", err?.response?.data ?? err);
      return null;
    }
  };

  // NOTE: For this local cart setup we are not calling addToCartApi
  // but function left here if you want to enable backend cart later.
  const addToCartApi = async (planId, billing_type) => {
    try {
      const res = await axios.post(
        `${API_BASE}/users/cart/add/`,
        { plan_id: planId, billing_type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      console.error("addToCartApi error:", err?.response?.data ?? err);
      return null;
    }
  };

  const rechargeWalletApi = async (amount) => {
    try {
      const res = await axios.post(
        `${API_BASE}/users/wallet/recharge/`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      console.error("rechargeWalletApi error:", err?.response?.data ?? err);
      return null;
    }
  };

  const validateMinAmount = (amount) => {
    if (Number(amount) < 300) {
      alert("Minimum allowed payment is ₹300. Please increase the amount.");
      return false;
    }
    return true;
  };

  // Helper — map lab name to free deploy action used by backend
  const getFreeAction = (labName) => {
    const name = (labName || "").toLowerCase();
    if (name.includes("redhat")) return "redhat";
    if (name.includes("linux")) return "linux";
    if (name.includes("docker")) return "docker";
    if (name.includes("kubernetes") || name.includes("k8s")) return "kubernetes";
    if (name.includes("terraform")) return "terraform";
    return "linux";
  };

  // ------- Fetch instances (and capture webssh_url when launched) -------
  const fetchInstances = async () => {
    if (!token || !userId) return;
    setLoadingInstances(true);
    try {
      const res = await axios.get(`${API_BASE}/lab/userinst/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let data = res.data || [];
      // sort: Launched first
      data.sort((a, b) =>
        a.status === "Launched" && b.status !== "Launched"
          ? -1
          : b.status === "Launched" && a.status !== "Launched"
          ? 1
          : 0
      );
      setInstances(data);

      // set webSSHUrl if any launched instance exists
      const launched = data.find((i) => i.status === "Launched");
      if (launched) {
        const url = launched.instance_url || launched.webssh_url || launched.user_instance_link || null;
        setWebSSHUrl(url || null);
      } else {
        setWebSSHUrl(null);
      }
    } catch (err) {
      console.error("Fetch instances error:", err?.response || err);
      // silent notify
    } finally {
      setLoadingInstances(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchInstances();
    const poll = setInterval(fetchInstances, 30000);
    return () => clearInterval(poll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ------- Launch Instance (free/paid) -------
  const launchInstance = async (lab, payment_id = "free") => {
    if (!token || !userId) {
      notify("Please login to continue", "error");
      navigate("/login");
      return false;
    }

    setLaunchingInstance(true);

    // snapshot of existing instance ids BEFORE deploy
    const beforeIds = instances.map((it) => it.id ?? it.user_instance_id ?? "");

    try {
      const endpoint =
        payment_id === "free"
          ? `${API_BASE}/users/deploy-free/${getFreeAction(lab.name)}/`
          : `${API_BASE}/users/deploy/${lab.planId}/`;

      const payload = {
        user_id: userId,
        action: lab.name,
      };

      if (payment_id !== "free") payload.payment_id = payment_id;

      await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      notify("Launching instance... (this can take a minute)", "info");

      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }

      // poll every 3s to detect launched instance
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
            // const win = window.open(newlyLaunched.web_ssh_url, "_blank");
            // if (win) win.focus();
            window.open(`/lab?user=${userId}`, "_blank")
            window.location.href = `/lab?user=${userId}`;//newlyLaunched.web_ssh_url;
            const url = newlyLaunched.web_ssh_url;// || newlyLaunched.webssh_url || newlyLaunched.user_instance_link;
            if (url) {
              setWebSSHUrl(url);
              try { window.open(url, "_blank"); } catch (err) {}
            }

            notify(`Instance launched: ${newlyLaunched.instance_ip || newlyLaunched.user_instance_id}`, "success");
          }
        } catch (err) {
          // continue polling
        }
      }, 3000);

      return true;
    } catch (err) {
      setLaunchingInstance(false);
      notify("Instance launch failed", "error");
      return false;
    }
  };

  // ------- Free instance wrapper -------
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
    const ok = await launchInstance(lab, "free");
    if (!ok) notify("Failed launching free instance", "error");
  };

  // ------- Add to cart (localStorage + UI) -------
// const addToCart = (lab: { planId: string; name: string; monthlyPrice: number; yearlyPrice?: number }, billingType: string) => {
//   const savedCart: CartItem[] = JSON.parse(localStorage.getItem("orl_cart") || "[]");

//   const price =
//     billingType === "monthly"
//       ? lab.monthlyPrice
//       : billingType === "yearly"
//       ? lab.yearlyPrice ?? lab.monthlyPrice
//       : 0;

//   // Avoid duplicates
//   const exists = savedCart.find((item) => item.planId === lab.planId && item.billingType === billingType);
//   if (exists) {
//     toast.info("Already in cart");
//     return;
//   }

//   const newCartItem: CartItem = {
//     planId: lab.planId,
//     name: lab.name,
//     billingType,
//     price,
//   };

//   savedCart.push(newCartItem);
//   localStorage.setItem("orl_cart", JSON.stringify(savedCart));
//   toast.success("Added to cart");
// };

// In your page/component


// const addToCart = (lab, billingType) => {
//   if (!lab) return;

//   const savedCart = JSON.parse(localStorage.getItem("orl_cart") || "[]");

//   const price =
//     billingType === "monthly"
//       ? lab.monthlyPrice
//       : billingType === "yearly"
//       ? lab.yearlyPrice ?? lab.monthlyPrice
//       : 0;

//   // Check duplicate
//   const exists = savedCart.find(
//     (item) =>
//       item.planId === lab.planId &&
//       item.billingType === billingType
//   );

//   if (exists) {
//     toast.info("Already in cart");
//     return;
//   }

//   const newCartItem = {
//     planId: lab.planId,
//     name: lab.name,
//     billingType,
//     price,
//   };

//   savedCart.push(newCartItem);

//   // Save to localStorage
//   localStorage.setItem("orl_cart", JSON.stringify(savedCart));

//   // ✅ Update state in the parent (Navbar)
//   setCartItems(savedCart);

//   toast.success("Added to cart");
// };
const addToCart = (lab, billingType) => {
  if (!lab) return;

  const savedCart = JSON.parse(localStorage.getItem("orl_cart") || "[]");

  const price =
    billingType === "monthly"
      ? lab.monthlyPrice
      : billingType === "yearly"
      ? lab.yearlyPrice ?? lab.monthlyPrice
      : 0;

  // Check duplicate
  const exists = savedCart.find(
    (item) =>
      item.planId === lab.planId &&
      item.billingType === billingType
  );

  if (exists) {
    toast.info("Already in cart", { autoClose: 2000 }); // auto closes after 2s
    return;
  }

  const newCartItem = {
    planId: lab.planId,
    name: lab.name,
    billingType,
    price,
  };

  savedCart.push(newCartItem);

  // Save to localStorage
  localStorage.setItem("orl_cart", JSON.stringify(savedCart));

  // ✅ Update state in the parent (Navbar)
  setCartItems(savedCart);

  // Show toast and auto close after 2 seconds
  toast.success("Added to cart", { autoClose: 2000 });

  // Reload page after 2.5 seconds
  setTimeout(() => {
    window.location.reload();
  }, 2500);
};


// ------- Compute cart total -------
const cartTotal = (Array.isArray(cartItems) ? cartItems : []).reduce(
  (sum, it) => sum + Number(it.price || 0),
  0
);


  // ------- Main plan click handler (used by button) -------
  const handlePlanClick = async (lab) => {
  if (!lab) {
    console.warn("handlePlanClick called without lab");
    return;
  }

  if (!token) {
    // notify("Please login to continue", "error");
    //navigate("/login");
    await addToCart(lab, billingType);
    return;
  }

  if (billingType === "free") {
    await launchFreeInstance(lab);
    return;
  }

  // 🔥 FIXED – Pass billing type
  await addToCart(lab, billingType);
};


  // ------- Compute cart total -------
  //const cartTotal = (Array.isArray(cartItems) ? cartItems : []).reduce((s, it) => s + Number(it.price || 0), 0);

  // ------- Checkout from Cart (Razorpay) -------
  const checkoutCart = async () => {
    if (!token) {
      notify("Please login to continue", "error");
      navigate("/login");
      return;
    }
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      notify("Cart is empty", "info");
      return;
    }

    const item = cartItems[0];
    const amount = Math.round(cartTotal); // rupees
    if (amount <= 0) {
      notify("Invalid amount", "error");
      return;
    }

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      notify("Razorpay SDK failed to load", "error");
      return;
    }

    const order = await createOrderOnBackend(amount);
    if (!order) {
      notify("Failed to create order on backend", "error");
      return;
    }

    const rAmount = order.amount ?? (order.order_amount ?? amount * 100);
    const rOrderId = order.order_id ?? order.id ?? order.orderId ?? order.orderId;

    const options = {
      key: order.key_id ?? order.keyId ?? "rzp_test_123456789",
      amount: rAmount,
      currency: "INR",
      name: "OnRequestLab",
      description: `${item.name} (${item.billingType})`,
      order_id: rOrderId,
      prefill: { name: user.name || "", email: user.email || "" },
      handler: async function (response) {
        const payload = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        };
        const verify = await verifyPaymentOnBackend(payload);
        if (!verify || !verify.success) {
          notify("Payment verification failed", "error");
          return;
        }

        // create subscription / activate plan on backend
        const sub = await createSubscriptionOnBackend(item.planId);
        if (!sub) {
          notify("Subscription creation failed", "error");
          return;
        }

        notify("Payment & subscription successful", "success");

        // Launch instance for this plan using payment id
        await launchInstance(item, response.razorpay_payment_id);

        // clear cart (local)
        try { localStorage.removeItem("orl_cart"); } catch (e) {}
        setCartItems([]);
        setShowCartModal(false);

        // navigate to overview or instances page
        navigate("/index/overview");
      },
      modal: { ondismiss: () => notify("Payment cancelled", "warning") },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ------- Wallet checkout for cart -------
  const walletCheckoutCart = async () => {
    if (!token) {
      notify("Please login to continue", "error");
      navigate("/login");
      return;
    }
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      notify("Cart is empty", "info");
      return;
    }
    const item = cartItems[0];
    const amount = Math.round(cartTotal);

    setLoadingWallet(true);
    try {
      const res = await axios.get(`${API_BASE}/users/wallet/balance/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bal = res.data?.balance ?? res.data?.wallet_amount ?? res.data;
      const currentBalance = typeof bal === "object" ? bal.balance ?? 0 : bal;

      if (Number(currentBalance) < Number(amount)) {
        setWalletButtonError(true);
        notify(`Insufficient wallet balance (₹${currentBalance}). Please recharge wallet or use Razorpay.`, "error");
        return;
      }

      const sub = await createSubscriptionOnBackend(item.planId);
      if (!sub) {
        notify("Subscription creation failed (wallet)", "error");
        return;
      }

      notify("Subscription activated using wallet", "success");
      await launchInstance(item, sub?.payment_id ?? "wallet");

      // clear cart
      try { localStorage.removeItem("orl_cart"); } catch (e) {}
      setCartItems([]);
      setShowCartModal(false);
      navigate("/index/overview");
    } catch (err) {
      console.error("Wallet checkout error:", err);
      notify("Wallet checkout failed", "error");
    } finally {
      setLoadingWallet(false);
    }
  };

  // ------- Recharge wallet (UI flow using Razorpay) -------
  const handleRecharge = async (amount) => {
    if (!token) {
      notify("Please login to continue", "error");
      navigate("/login");
      return;
    }
    if (!validateMinAmount(amount)) return;

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      notify("Razorpay SDK failed to load", "error");
      return;
    }

    const order = await createOrderOnBackend(amount);
    if (!order) {
      notify("Failed to create order on backend", "error");
      return;
    }

    const rAmount = order.amount ?? (order.order_amount ?? amount * 100);
    const rOrderId = order.order_id ?? order.id ?? order.orderId ?? order.orderId;

    const options = {
      key: order.key_id ?? order.keyId ?? "rzp_test_123456789",
      amount: rAmount,
      currency: "INR",
      name: "OnRequestLab (Wallet)",
      description: `Wallet recharge ₹${amount}`,
      order_id: rOrderId,
      prefill: { name: user.name || "", email: user.email || "" },
      handler: async function (response) {
        const payload = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        };
        const verify = await verifyPaymentOnBackend(payload);
        if (!verify || !verify.success) {
          notify("Payment verification failed", "error");
          return;
        }

        const credit = await rechargeWalletApi(amount);
        if (credit) {
          notify("Wallet recharged successfully", "success");
          fetchWalletBalance();
        } else {
          notify("Wallet recharge failed", "error");
        }
      },
      modal: { ondismiss: () => notify("Wallet recharge cancelled", "warning") },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ------- Reboot & destroy instance helpers -------
  const rebootInstance = async (id) => {
    if (!token) {
      notify("Please login", "error");
      return;
    }
    if (!window.confirm("Are you sure you want to reboot this instance?")) return;
    try {
      await axios.post(`${API_BASE}/users/reboot/${id}/`, {}, { headers: { Authorization: `Bearer ${token}` } });
      notify("Reboot initiated!", "success");
    } catch (err) {
      notify("Failed to reboot instance", "error");
    }
  };

  const destroyInstance = async (instance) => {
    if (!token) {
      notify("Please login", "error");
      return;
    }
    if (!window.confirm("Are you sure to destroy this instance?")) return;
    try {
      if (!instance.payment_id) {
        await axios.post(`${API_BASE}/users/deploy-free/destroy/`, { user_id: instance.user_instance_id }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${API_BASE}/users/deploy-experimental/destroy/`, { user_id: instance.user_instance_id }, { headers: { Authorization: `Bearer ${token}` } });
      }
      notify("Destroy request sent", "success");
      setTimeout(() => {
        axios.get(`${API_BASE}/lab/userinst/${userId}/`, { headers: { Authorization: `Bearer ${token}` } })
          .then(r => setInstances(r.data || []))
          .catch(() => {});
      }, 3000);
    } catch (err) {
      notify("Failed to destroy instance", "error");
    }
  };

  // ------- copy helper -------
  const copyToClipboard = (text) => {
    if (!navigator.clipboard) return notify("Clipboard not available", "error");
    navigator.clipboard.writeText(text);
    notify("Copied to clipboard", "success");
  };

  // keep localStorage in sync when cartItems changes
  // useEffect(() => {
  //   try { localStorage.setItem("orl_cart", JSON.stringify(cartItems)); } catch (e) {}
  // }, [cartItems]);

  // // cleanup polling on unmount
  // useEffect(() => {
  //   return () => {
  //     if (pollRef.current) {
  //       clearInterval(pollRef.current);
  //       pollRef.current = null;
  //     }
  //   };
  // }, []);
  // Save cart to localStorage whenever cartItems changes
useEffect(() => {
  try {
    localStorage.setItem("orl_cart", JSON.stringify(cartItems));
  } catch (error) {
    console.error("Failed to save cart:", error);
  }
}, [cartItems]);

// Clear polling interval on component unmount
useEffect(() => {
  return () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };
}, []);


  // ======= Render UI =======
  return (
    <div id="courses" className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-6">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent mb-4">
            Simple pricing. No surprise fees.
          </h1>
          <p className="text-gray-400 mt-6 text-xl max-w-2xl mx-auto">Choose the perfect lab for your learning journey and start practicing today</p>
          {/* <div className="mt-4 text-sm text-gray-300">
            Wallet: {loadingWallet ? "Checking..." : walletBalance !== null ? `₹${walletBalance}` : "Unknown"}{" "}
            {walletBalance !== null && <span className="ml-3 text-xs text-gray-400">(You can pay from wallet if sufficient)</span>}
          </div> */}
          {/* <div className="mt-3">
            <button onClick={() => navigate("/cart")} className="text-sm text-gray-300 hover:text-white px-3 py-1 border border-white/10 rounded-full">
              Cart ({Array.isArray(cartItems) ? cartItems.length : 0}) — ₹{cartTotal}
            </button>
          </div> */}
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-1">
            {["free", "monthly", "yearly", "payAsYouGo"].map((type) => (
              <button
                key={type}
                onClick={() => setBillingType(type)}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  billingType === type
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {type === "payAsYouGo" ? "Pay as you go" : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {labs.map((lab, index) => (
            <div key={index} className={`relative group transition-all duration-500 hover:-translate-y-2`} style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}>
              <div className={`relative h-full bg-white/5 backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-300 ${lab.popular ? "border-purple-500/50 shadow-2xl shadow-purple-500/20" : "border-white/10 hover:border-purple-500/30"}`}>
                {lab.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1.5 rounded-bl-xl rounded-tr-2xl text-sm font-bold shadow-lg">Popular</div>
                  </div>
                )}
                <div className="relative p-8">
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold text-white mb-2">{lab.name}</h3>
                    <p className="text-purple-300 text-sm font-medium">{lab.subtitle}</p>
                  </div>

                  {/* Pricing */}
                  <div className="mb-8">
                    {billingType === "free" && lab.free && (lab.free.available ? (
                      <>
                        <div className="flex items-baseline gap-2 mb-2"><span className="text-3xl font-bold text-white">Free</span></div>
                        <div className="inline-block bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1 mt-2">
                          <span className="text-green-400 text-xs font-semibold">{lab.free.duration}</span>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">No credit card required</p>
                      </>
                    ) : <div className="text-gray-400 text-sm">Free trial not available for this lab</div>)}

                    {billingType === "monthly" && (
                      <div>
                        <div className="flex items-baseline gap-2 mb-2"><span className="text-3xl font-bold text-white">₹{lab.monthlyPrice}</span><span className="text-gray-400 text-lg">/month</span></div>
                        <p className="text-gray-400 text-sm">Billed Monthly</p>
                      </div>
                    )}

                    {billingType === "yearly" && (
                      <div>
                        <div className="flex items-baseline gap-2 mb-2"><span className="text-3xl font-bold text-white">₹{lab.yearlyPrice}</span><span className="text-gray-400 text-lg">/year</span></div>
                        <div className="inline-block bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1 mt-2">
                          <span className="text-green-400 text-xs font-semibold">Save ₹{(lab.monthlyPrice * 12 - lab.yearlyPrice).toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    {billingType === "payAsYouGo" && (
                      <div className="transition-all duration-300">
                        <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                          <span className="text-gray-400 text-sm">Hourly Rate</span>
                          <span className="text-white font-bold">₹{lab.payAsYouGo.hourlyRate}/hr</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <p className="text-gray-400 font-medium mb-4 text-sm uppercase tracking-wider">What's included</p>
                    <ul className="space-y-3">
                      {getCurrentFeatures(lab).map((feature, idx) => {
                        const isObject = typeof feature === "object";
                        const featureText = isObject ? feature.text : feature;
                        const hasModal = isObject && feature.hasModal;
                        return (
                          <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                            <Check className="w-4 h-4 text-green-400" />
                            {featureText}
                            {hasModal && (
                              <button onClick={() => setShowLabListModal(true)} className="ml-auto text-blue-400 hover:underline text-xs">See labs</button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-3">
                    <button
                      className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40"
                      onClick={() => handlePlanClick(lab)}
                    >
                      {billingType === "free" ? (launchingInstance ? "Launching..." : "Start Free Trial") : "Get Started"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instances Panel */}
        {/* <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Your Instances</h3>
              <div className="text-sm text-gray-400">{loadingInstances ? "Refreshing..." : `${instances.length} item(s)`}</div>
            </div>

            {instances.length === 0 ? (
              <div className="text-gray-400">No instances yet. Launch a lab to get started.</div>
            ) : (
              <ul className="space-y-3">
                {instances.map((inst, i) => (
                  <li key={i} className="bg-white/5 p-3 rounded flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold">{inst.user_instance_name || inst.user_instance_id || `Instance ${i + 1}`}</div>
                      <div className="text-gray-400 text-sm">Status: {inst.status} {inst.is_free ? "(free)" : ""}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {inst.instance_ip && <button className="px-3 py-1 bg-gray-800 rounded text-white text-sm" onClick={() => copyToClipboard(inst.instance_ip)}>Copy IP</button>}
                      {(inst.instance_url || inst.webssh_url || inst.user_instance_link) && (
                        <button className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded text-white text-sm" onClick={() => window.open(inst.instance_url || inst.webssh_url || inst.user_instance_link, "_blank")}>Open</button>
                      )}
                      <button className="px-3 py-1 bg-red-700 rounded text-white text-sm" onClick={() => destroyInstance(inst)}>Destroy</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div> */}
      </div>

      {/* Lab List Modal */}
      {showLabListModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-gray-900 rounded-xl p-8 max-w-lg w-full relative">
            <button className="absolute top-4 right-4 text-white" onClick={() => setShowLabListModal(false)}>
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-white text-2xl font-bold mb-4">Lab List</h2>
            <ul className="text-gray-300 space-y-2">
              {allLabs.map((l, idx) => <li key={idx}>{l}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-end z-50">
          <div className="w-full md:w-[420px] bg-gray-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-xl font-bold">Your Cart</h3>
              <div>
                <button className="text-gray-300 mr-2" onClick={() => { setShowCartModal(false); }}>
                  Close
                </button>
                <button className="text-white bg-gray-800 px-3 py-1 rounded" onClick={() => { setCartItems([]); try{ localStorage.removeItem("orl_cart"); }catch(e){}; notify("Cart cleared", "info"); }}>
                  Clear
                </button>
              </div>
            </div>

            {!Array.isArray(cartItems) || cartItems.length === 0 ? (
              <div className="text-gray-400">Your cart is empty.</div>
            ) : (
              <>
                <ul className="space-y-3 mb-4">
                  {cartItems.map((it, i) => (
                    <li key={i} className="bg-white/5 p-3 rounded flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold">{it.name}</div>
                        <div className="text-gray-400 text-sm">{it.billingType}</div>
                      </div>
                      <div className="text-white font-bold">₹{it.price}</div>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-gray-400">Total</div>
                  <div className="text-white font-bold">₹{cartTotal}</div>
                </div>

                <div className="space-y-3">
                  <button onClick={checkoutCart} className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold">
                    Pay with Razorpay
                  </button>

                  <button onClick={walletCheckoutCart} className={`w-full px-4 py-3 rounded-lg text-white font-semibold ${walletButtonError ? "bg-red-600" : "bg-white/5"}`}>
                    {loadingWallet ? "Checking wallet..." : `Pay from Wallet (₹${walletBalance ?? 0})`}
                  </button>

                  <div className="pt-2">
                    <label className="text-gray-300 text-sm block mb-2">Recharge wallet (min ₹300)</label>
                    <div className="flex gap-2">
                      <input type="number" min="300" placeholder="Amount" className="flex-1 px-3 py-2 rounded bg-white/5 text-white" id="rechargeAmount" />
                      <button className="px-3 py-2 bg-green-600 rounded" onClick={() => {
                        const el = document.getElementById("rechargeAmount");
                        const val = el ? (el.value || "") : "";
                        if (!val) return notify("Enter amount", "info");
                        handleRecharge(Number(val));
                      }}>
                        Recharge
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal (used for manual payment/wallet flows) */}
      {showPaymentPopup && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full relative">
            <button className="absolute top-4 right-4 text-white" onClick={() => setShowPaymentPopup(false)}>
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-white text-2xl font-bold mb-4">{useWallet ? "Pay from Wallet" : "Pay with Razorpay"}</h2>
            <label className="text-gray-300 text-sm mb-2 block">Enter amount (₹):</label>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg text-black mb-4"
              min="300"
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-700 text-white"
                onClick={() => setShowPaymentPopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                onClick={async () => {
                  if (!validateMinAmount(paymentAmount)) return;
                  setShowPaymentPopup(false);
                  if (useWallet) {
                    notify("Wallet payment flow not implemented here", "info");
                  } else {
                    notify("Use cart checkout for subscriptions", "info");
                  }
                }}
              >
                Pay ₹{paymentAmount}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabPricing;
