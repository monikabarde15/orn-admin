import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "https://backend.onrequestlab.com/api/v1";

const CartPage = () => {
const navigate = useNavigate();
const [cartItems, setCartItems] = useState([]);
const [loading, setLoading] = useState(false);
const [processing, setProcessing] = useState(false);
const [upgradeInProgress, setUpgradeInProgress] = useState(false);
const pollRef = useRef(null);

const getCookie = (name) => {
if (typeof document === "undefined") return "";
const v = `; ${document.cookie}`;
const parts = v.split(`; ${name}=`);
if (parts.length === 2) return parts.pop().split(";").shift();
return "";
};

const token =
(getCookie("access") ||
localStorage.getItem("access") ||
localStorage.getItem("jwt-auth"))?.trim();
const userId = getCookie("user_id");

const notify = (msg, type = "info", opts = {}) =>
toast[type](msg, {
position: "top-center",
autoClose: 2000,
closeButton: true,
closeOnClick: true,
pauseOnHover: true,
draggable: true,
...opts,
});

useEffect(() => {
try {
const saved = JSON.parse(localStorage.getItem("orl_cart") || "[]");
setCartItems(saved || []);
} catch {
setCartItems([]);
}
}, []);

const totalAmount = cartItems.reduce(
(sum, i) => sum + Number(i.price || 0),
0
);

useEffect(() => {
return () => {
if (pollRef.current) clearInterval(pollRef.current);
};
}, []);

const removeItem = (index) => {
const updated = [...cartItems];
updated.splice(index, 1);
setCartItems(updated);
localStorage.setItem("orl_cart", JSON.stringify(updated));
toast.dismiss();
notify("Item removed from cart", "info");
};

const checkWallet = async () => {
try {
const res = await axios.get(`${API_BASE}/users/wallet/balance/`, {
headers: { Authorization: `Bearer ${token}` },
});
return res.data?.balance ?? 0;
} catch {
return 0;
}
};

const formatAction = (name) =>
name.toLowerCase().replace(/\s+/g, "*").replace(/[^a-z0-9*]/g, "");

// const createSubscriptionOnBackend = async (planId) => {
//   try {
//   const res = await axios.post(
//   `${API_BASE}/users/subscriptions/create/${planId}/`,
//   {},
//   { headers: { Authorization: `Bearer ${token}` } }
//   );
//   return res.data;
//   } catch (err) {
//   console.error(
//   "createSubscriptionOnBackend error:",
//   err?.response?.data ?? err
//   );

//   return null;
//   }
// };
const createSubscriptionOnBackend = async (planId, price) => {
  try {
    const res = await axios.post(
      `${API_BASE}/users/subscriptions/create/${planId}/`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    const data = err?.response?.data;
    if (data?.error === "Insufficient wallet balance") {
      const balance = data.balance || 0;
      const required = data.required || price;
      const remaining = required - balance;
      notify(`Wallet insufficient. Paying ₹${remaining} via Razorpay`, "warning");
      await openRazorpay(remaining);
    } else {
      notify(data?.error || "Subscription creation failed", "error");
    }
    return null;
  }
};

const launchSingle = async (lab, paymentId) => {
try {
if (!lab.subscription) {
const createdSub = await createSubscriptionOnBackend(lab.planId);
if (createdSub) {
lab.subscription = createdSub;
notify(`Subscription for ${lab.name} created automatically!`, "success");
} else {
notify(`Failed to create subscription for ${lab.name}`, "error");
return;
}
}

  const action = formatAction(lab.name);
  const endpoint =
    paymentId === "free"
      ? `${API_BASE}/users/deploy-free/${action}/`
      : `${API_BASE}/users/deploy/${action}/`;

  const body =
    paymentId === "free"
      ? { user_id: userId, action }
      : { user_id: userId, action, payment_id: paymentId };

  await axios.post(endpoint, body, {
    headers: { Authorization: `Bearer ${token}` },
  });

  notify(`Instance ${lab.name} launched successfully!`, "success");
} catch (err) {
  notify(err?.response?.data?.message || "Instance launch failed", "error");
}

};

const pollForLaunchedInstances = (paymentId = null) => {
if (pollRef.current) clearInterval(pollRef.current);

pollRef.current = setInterval(async () => {
  try {
    const res = await axios.get(`${API_BASE}/lab/userinst/${userId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const instances = res.data || [];

    const launched = instances.find((i) => {
      const isLaunched = i.status === "Launched";
      if (!isLaunched) return false;

      if (!paymentId) return true;
      if (paymentId === "free")
        return i.is_free || !i.payment_id || i.payment_id === "free";
      return i.payment_id === paymentId;
    });

    if (launched) {
      clearInterval(pollRef.current);
      pollRef.current = null;

      localStorage.removeItem("orl_cart");
      setCartItems([]);

      const url = launched.web_ssh_url || launched.webssh_url || launched.user_instance_link;
      if (url) try { window.open(url, "_blank"); } catch (err) {}

      window.location.href = `/lab?user=${userId}`;
      notify(
        `Instance launched: ${launched.instance_ip || launched.user_instance_id}`,
        "success"
      );
    }
  } catch (err) {
    console.error("Polling error:", err);
  }
}, 1000);

};

const loadRazorpay = () =>
new Promise((resolve) => {
if (window.Razorpay) return resolve(true);
const s = document.createElement("script");
s.src = "https://checkout.razorpay.com/v1/checkout.js";
s.onload = () => resolve(true);
s.onerror = () => resolve(false);
document.body.appendChild(s);
});

const openRazorpay = async (amount) => {
try {
const loaded = await loadRazorpay();
if (!loaded) return notify("Failed to load Razorpay", "error");

  const orderRes = await axios.post(
    `${API_BASE}/users/create-order/`,
    { amount },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const order = orderRes.data;

  const options = {
    key: order.key_id,
    amount: order.amount * 100,
    currency: "INR",
    name: "OnRequestLab",
    description: "Lab Instance Payment",
    order_id: order.order_id,
    handler: async function (response) {
      try {
        const verify = await axios.post(
          `${API_BASE}/users/verify-payment/`,
          {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!verify.data.success)
          return notify("Payment verification failed", "error");

        notify("Payment Successful! Launching Instances...", "success");
        setProcessing(true);

        await Promise.all(
          cartItems.map((item) => launchSingle(item, response.razorpay_payment_id))
        );
        pollForLaunchedInstances();
      } catch {
        notify("Payment verification failed", "error");
      }
    },
    modal: { ondismiss: () => notify("Payment cancelled", "info") },
    theme: { color: "#3399cc" },
  };

  new window.Razorpay(options).open();
} catch (err) {
  console.error("Razorpay Error:", err);
  notify("Payment Failed!", "error");
}

};

const handleCheckout = async () => {
if (loading || processing || upgradeInProgress) return;
if (!cartItems.length) return notify("Cart empty", "info");

setLoading(true);

try {
  for (const item of cartItems) {
    if (!item.subscription) {
      const sub = await createSubscriptionOnBackend(item.planId);
      if (!sub) {
        notify(`Failed to create subscription for ${item.name}`, "error");
        continue;
      }
      item.subscription = sub;
      notify(`Subscription created for ${item.name}`, "success");
    }

    const wallet = await checkWallet();
    const remaining = Math.max(0, item.price - wallet);

    if (remaining === 0) {
      notify(`₹${item.price} deducted from Wallet. Launching ${item.name}...`, "success");
      await launchSingle(item, "wallet");
    } else {
      notify(`Wallet ₹${wallet} insufficient for ${item.name}. Paying ₹${remaining} via Razorpay`, "warning");
      await new Promise((resolve) => { openRazorpay(remaining); resolve(); });
    }
  }
  pollForLaunchedInstances();
} catch (err) {
  notify(err?.response?.data?.message || "Checkout failed", "error");
} finally {
  setLoading(false);
}

};

const handleUpgrade = async (item) => {
if (upgradeInProgress) return;
const confirmUpgrade = window.confirm("Do you want to upgrade this plan?");
if (!confirmUpgrade) return;

setUpgradeInProgress(true);

try {
  const wallet = await checkWallet();
  const remaining = Math.max(0, item.price - wallet);

  if (remaining === 0) {
    notify(`₹${item.price} deducted from Wallet. Upgrading ${item.name}...`, "success");
    await launchSingle(item, "wallet");
    pollForLaunchedInstances();
  } else {
    notify(`Wallet ₹${wallet} insufficient. Paying ₹${remaining} via Razorpay for upgrade`, "warning");
    await new Promise((resolve) => { openRazorpay(remaining); resolve(); });
  }
} catch (err) {
  notify(err?.response?.data?.message || "Upgrade failed", "error");
} finally {
  setUpgradeInProgress(false);
}

};

return (
<> <Navbar /> <ToastContainer /> <div className="min-h-screen bg-[#070B19] text-white px-4 py-10"> <h1 className="text-4xl font-bold text-center mb-12 text-purple-300">🛒 Your Cart</h1>

    {!cartItems.length ? (
      <p className="text-center text-xl text-gray-400">Your cart is empty.</p>
    ) : (
      <div className="max-w-3xl mx-auto space-y-6">
        {cartItems.map((item, idx) => (
          <div key={idx} className="bg-[#10172A] border border-white/10 p-6 rounded-2xl flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-purple-300">{item.name}</h2>
              <p className="text-gray-300 mt-1">
                Billing: <span className="text-purple-400 ml-2 font-bold">{item.billingType.toUpperCase()}</span>
              </p>
              <p className="text-3xl font-bold text-green-400 mt-3">₹ {item.price}</p>
            </div>
            <div className="flex space-x-3">
              <button onClick={() => removeItem(idx)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-bold text-white">Remove</button>
              <button onClick={() => handleUpgrade(item)} disabled={!item.subscription || loading || processing || upgradeInProgress} className={`px-4 py-2 rounded-xl font-bold text-white ${item.subscription ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 cursor-not-allowed"}`}>Upgrade</button>
            </div>
          </div>
        ))}

        <div className="text-4xl font-bold text-right mt-6 text-green-400">Total: ₹{totalAmount}</div>

        <button onClick={handleCheckout} disabled={loading || processing || upgradeInProgress || !cartItems.some((i) => !i.subscription)} className={`w-full py-4 rounded-xl mt-5 text-2xl font-semibold ${loading || processing || upgradeInProgress || !cartItems.some((i) => !i.subscription) ? "bg-gray-700 cursor-not-allowed" : "bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105"}`}>
          {loading ? "Processing..." : processing ? "Launching..." : "Checkout & Pay"}
        </button>
      </div>
    )}
  </div>
  <Footer />
</>

);
};

export default CartPage;
