import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Message from "../MessagesList";

const API_BASE = "https://backend.onrequestlab.com/api/v1";

interface Instance {
  user_instance_id: string;
  instance_type: string;
  instance_ip?: string;
  status: string;
  payment_id?: string;
  order_id?: string;
  web_ssh_url?: string;
  instance_name?: string;
  dp_key?: string;
  secret_key?: string;
  AccessKeyId?: string;
  SecretAccessKey?: string;
}

interface Payment {
  payment_id: string;
  type: string;
  amount: number;
  refunded: boolean;
}

const LabManager: React.FC = () => {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [launchingInstance, setLaunchingInstance] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState<"free" | "paid" | "">("");
  const [selectedFreeType, setSelectedFreeType] = useState("");
  const [selectedPaidType, setSelectedPaidType] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPaymentId, setLastPaymentId] = useState<string | null>(null);

  const [viewModal, setViewModal] = useState<{ open: boolean; dp?: string; secret?: string }>({ open: false });
  const [feedbackModal, setFeedbackModal] = useState<{ open: boolean; instanceId?: string }>({ open: false });
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const pageSize = 5;

  const getCookie = (name: string) => {
    if (typeof document === "undefined") return "";
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
    return "";
  };

  const userId = getCookie("user_id");

  // Load token
  useEffect(() => {
    const tokenFromCookie = getCookie("access");
    const tokenFromStorage = localStorage.getItem("jwt-auth") || localStorage.getItem("access");
    const token = (tokenFromCookie || tokenFromStorage || "").trim();
    setAccessToken(token);
  }, []);

  // Fetch instances when token is ready
  useEffect(() => {
    if (accessToken) fetchInstances();
  }, [accessToken]);

  // Load stored payments
  useEffect(() => {
    const storedPayments = localStorage.getItem("payments");
    if (storedPayments) setPayments(JSON.parse(storedPayments));
  }, []);

  useEffect(() => {
    localStorage.setItem("payments", JSON.stringify(payments));
  }, [payments]);

  const fetchInstances = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/lab/userinst/${userId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      let data: Instance[] = res.data || [];
      data.sort((a, b) =>
        a.status === "Launched" && b.status !== "Launched"
          ? -1
          : b.status === "Launched" && a.status !== "Launched"
          ? 1
          : 0
      );
      setInstances(data);
    } catch (err: any) {
      console.error("Fetch instances error:", err?.response || err);
      toast.error("Failed to fetch instances");
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () =>
    new Promise<boolean>((resolve) => {
      if (typeof document === "undefined") return resolve(false);
      const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existing) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const getFreeAction = (type: string) => {
    switch (type) {
      case "linux":
        return "linux";
      case "iscsi":
        return "iscsi";
      case "redhat":
        return "redhat";
      default:
        return "";
    }
  };

  const handlePlanSelection = async (plan: "free" | "paid") => {
    if (!accessToken) return toast.error("No access token available");
    if (plan === "free") {
      if (!selectedFreeType) return toast.error("Select free instance type");
      await launchInstance(selectedFreeType, "free");
    } else {
      if (!selectedPaidType) return toast.error("Select paid instance type");
      await payThenLaunch(selectedPaidType);
    }
  };

  const payThenLaunch = async (type: string) => {
    if (!accessToken) return toast.error("No access token available");

    const loaded = await loadRazorpayScript();
    if (!loaded) return toast.error("Failed to load Razorpay");

    try {
      const orderRes = await axios.post(
        `${API_BASE}/users/create-order/`,
        { amount: 100 },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const options = {
        key: orderRes.data.key_id,
        order_id: orderRes.data.order_id,
        amount: 100 * 100,
        name: "OnRequestLab",
        description: "Instance Payment",
        handler: async (response: any) => {
          try {
            const verify = await axios.post(
              `${API_BASE}/users/verify-payment/`,
              response,
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            if (verify.data.success) {
              toast.success("Payment successful!");
              const newPayment: Payment = { payment_id: response.razorpay_payment_id, type, amount: 100, refunded: false };
              setPayments((prev) => [...prev, newPayment]);
              setLastPaymentId(response.razorpay_payment_id);
              await launchInstance(type, response.razorpay_payment_id);
              fetchInstances();
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            console.error("Verify payment error:", err);
            toast.error("Error verifying payment");
          }
        },
        modal: { ondismiss: () => toast.warning("Payment cancelled") },
        prefill: { name: "User", email: "user@example.com" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Create order error:", err);
      toast.error("Error creating Razorpay order");
    }
  };

  const launchInstance = async (type: string, payment_id?: string | "free") => {
    if (!accessToken) return;
    setLaunchingInstance(true);
    try {
      const endpoint =
        selectedPlan === "free"
          ? `${API_BASE}/users/deploy-free/${getFreeAction(type)}/`
          : `${API_BASE}/users/deploy/${type}/`;

      await axios.post(
        endpoint,
        { user_id: userId, payment_id: payment_id === "free" ? undefined : payment_id, action: type },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      toast.info("Launching instance...");

      const interval = setInterval(async () => {
        try {
          const res = await axios.get(`${API_BASE}/lab/userinst/${userId}/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
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

          const newlyLaunched = latest.find(
            (i: Instance) => i.status === "Launched" && (payment_id === "free" || i.payment_id === payment_id)
          );
          if (newlyLaunched) {
            clearInterval(interval);
            toast.success(`Instance launched: ${newlyLaunched.instance_ip || newlyLaunched.user_instance_id}`);
            setLaunchingInstance(false);
          }
        } catch (err) {
          console.error("Polling launch status error:", err);
        }
      }, 3000);
    } catch (err) {
      console.error("Launch instance error:", err);
      toast.error("Instance launch failed");
      setLaunchingInstance(false);
    }
  };

  const refundPayment = async (payment_id: string) => {
    if (!accessToken) return toast.error("No access token available");
    if (!window.confirm("Are you sure you want to request a refund for this payment?")) return;

    try {
      const res = await axios.post(`${API_BASE}/users/refund-payment/`, { payment_id }, { headers: { Authorization: `Bearer ${accessToken}` } });
      if (res.data?.success) {
        toast.success("Refund successful!");
        setPayments((prev) => prev.map((p) => (p.payment_id === payment_id ? { ...p, refunded: true } : p)));
        setLastPaymentId(null);
      } else {
        toast.info(res.data?.message || "Refund request submitted");
      }
    } catch (err: any) {
      console.error("Refund error:", err?.response || err);
      toast.error("Failed to process refund");
    }
  };

  const rebootInstance = async (id: string) => {
    if (!accessToken) return toast.error("No access token available");
    if (!window.confirm("Are you sure you want to reboot this instance?")) return;
    try {
      await axios.post(`${API_BASE}/users/reboot/${id}/`, {}, { headers: { Authorization: `Bearer ${accessToken}` } });
      toast.success("Reboot initiated!");
    } catch (err: any) {
      console.error("Reboot error:", err?.response || err);
      toast.error("Failed to reboot instance");
    }
  };

  const destroyInstance = async (instance: Instance) => {
    if (!accessToken) return toast.error("No access token available");
    if (!window.confirm("Are you sure to destroy this instance?")) return;

    try {
      if (!instance.payment_id) {
        await axios.post(
          `${API_BASE}/users/deploy-free/destroy/`,
          { user_id: instance.user_instance_id },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      } else {
        await axios.post(
          `${API_BASE}/users/deploy-experimental/destroy/`,
          { user_id: instance.user_instance_id },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }
      toast.success("Destroy request sent");
      setTimeout(fetchInstances, 3000);
    } catch (err) {
      console.error("Destroy instance error:", err);
      toast.error("Failed to destroy instance");
    }
  };

  const sendFeedback = async () => {
    if (!accessToken) return toast.error("No access token available");
    if (!feedbackSubject || !feedbackMessage) return toast.error("Fill all fields");
    try {
      await axios.post(`${API_BASE}/feedback/feedback_vc/`, { user: userId, subject: feedbackSubject, description: feedbackMessage }, { headers: { Authorization: `Bearer ${accessToken}` } });
      toast.success("Feedback sent!");
      setFeedbackModal({ open: false });
      setFeedbackSubject("");
      setFeedbackMessage("");
    } catch (err) {
      console.error("Feedback error:", err);
      toast.error("Failed to send feedback");
    }
  };

  const copyToClipboard = (text: string) => {
    if (!navigator.clipboard) return toast.error("Clipboard not available");
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // Pagination and filtering
  const filtered = instances.filter(
    (i) =>
      (i.instance_type || "").toLowerCase().includes(search.toLowerCase()) ||
      (i.status || "").toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const displayed = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Lab Manager</h2>

      {/* Plan selection */}
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <select
          className="border px-2 py-1 rounded"
          value={selectedPlan}
          onChange={(e) => setSelectedPlan(e.target.value as "free" | "paid" | "")}
        >
          <option value="">Select Plan</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>

        {selectedPlan === "free" && (
          <select
            className="border px-2 py-1 rounded"
            value={selectedFreeType}
            onChange={(e) => setSelectedFreeType(e.target.value)}
          >
            <option value="">Select Free Instance</option>
            <option value="linux">Linux (1 bare-metal instance, 1 hour)</option>
            <option value="iscsi">iSCSI (2 bare-metal instances: iscsiserver & iscsiclient, 1 hour)</option>
            <option value="redhat">RedHat (3 AWS instances: nodea, nodeb & nodec, 1 hour)</option>
          </select>
        )}

        {selectedPlan === "paid" && (
          <select
            className="border px-2 py-1 rounded"
            value={selectedPaidType}
            onChange={(e) => setSelectedPaidType(e.target.value)}
          >
            <option value="">Select Paid Instance</option>
            <option value="linux">Linux (1 bare-metal, 8 hours)</option>
            <option value="iscsi">iSCSI (2 bare-metal: iscsiserver & iscsiclient, 3 hours)</option>
            <option value="redhat">RedHat (3 AWS nodes: nodea, nodeb & nodec, 3 hours)</option>
          </select>
        )}

        <button
          className={`px-4 py-1 rounded text-white ${
            selectedPlan === "free" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={() => handlePlanSelection(selectedPlan as "free" | "paid")}
          disabled={
            selectedPlan === "" ||
            (selectedPlan === "free" && selectedFreeType === "") ||
            (selectedPlan === "paid" && selectedPaidType === "")
          }
        >
          {selectedPlan === "free" ? "Launch Free" : "Pay"}
        </button>

        {/* Refund button immediately after successful payment */}
        {lastPaymentId &&
          selectedPlan === "paid" &&
          (() => {
            const payment = payments.find((p) => p.payment_id === lastPaymentId);
            return payment && !payment.refunded ? (
              <button
                className="px-4 py-1 rounded text-white bg-orange-500 hover:bg-orange-600"
                onClick={() => refundPayment(lastPaymentId)}
              >
                Refund
              </button>
            ) : null;
          })()}

        <input
          type="text"
          placeholder="Search by type/status..."
          className="border px-2 py-1 rounded ml-2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Instances table */}
      <table className="min-w-full bg-white border rounded shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-3">ID</th>
            <th className="py-2 px-3">Type</th>
            <th className="py-2 px-3">IP</th>
            <th className="py-2 px-3">Status</th>
            <th className="py-2 px-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : displayed.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No instances
              </td>
            </tr>
          ) : (
            displayed.map((i) => {
              const payId = i.payment_id || i.order_id;
              const paymentRecord = payments.find((p) => p.payment_id === payId);
              const dpKey = i.dp_key || i.AccessKeyId || "";
              const secretKey = i.secret_key || i.SecretAccessKey || "";

              return (
                <tr key={i.user_instance_id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-3">{i.user_instance_id}</td>
                  <td className="py-2 px-3">{i.instance_type}</td>
                  <td className="py-2 px-3">{i.instance_ip || "-"}</td>
                  <td className="py-2 px-3">{i.status}</td>
                  <td className="py-2 px-3 flex gap-2">
                    {payId && i.status === "Launched" && paymentRecord && !paymentRecord.refunded && (
                      <button className="px-2 py-1 rounded text-white bg-orange-500 hover:bg-orange-600" onClick={() => refundPayment(payId)}>
                        Refund
                      </button>
                    )}
                    {i.web_ssh_url && (
                      <>
                        <button
                          className={`px-2 py-1 rounded text-white ${i.status === "Terminated" ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"}`}
                          disabled={i.status === "Terminated"}
                          onClick={() => i.status !== "Terminated" && window.open(`/lab?user=${userId}`, "_blank")}
                        >
                          SSH
                        </button>
                        <button className="px-2 py-1 rounded text-white bg-indigo-500 hover:bg-indigo-600" onClick={() => setViewModal({ open: true, dp: dpKey, secret: secretKey })}>
                          View
                        </button>
                      </>
                    )}
                    {i.status === "Launched" && (
                      <>
                        <button className="px-2 py-1 rounded text-white bg-blue-500 hover:bg-blue-600" onClick={() => rebootInstance(i.user_instance_id)}>
                          Reboot
                        </button>
                        <button className="px-2 py-1 rounded text-white bg-red-500 hover:bg-red-600" onClick={() => destroyInstance(i)}>
                          Destroy
                        </button>
                        <button className="px-2 py-1 rounded text-white bg-purple-500 hover:bg-purple-600" onClick={() => setFeedbackModal({ open: true, instanceId: i.user_instance_id })}>
                          Feedback
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex gap-2 justify-center">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button key={idx} className={`px-3 py-1 rounded ${currentPage === idx + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setCurrentPage(idx + 1)}>
              {idx + 1}
            </button>
          ))}
        </div>
      )}

      {/* View Modal */}
      {viewModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow w-96 relative">
            <h3 className="text-lg font-semibold mb-2">Keys</h3>
            <div className="mb-2">
              <strong>DP / Access Key:</strong> {viewModal.dp}
            </div>
            <div className="mb-2">
              <strong>Secret Key:</strong> {viewModal.secret}
            </div>
            <button className="absolute top-2 right-2 text-red-600 font-bold" onClick={() => setViewModal({ open: false })}>
              X
            </button>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow w-96 relative">
            <h3 className="text-lg font-semibold mb-2">Feedback</h3>
            <input type="text" placeholder="Subject" className="w-full border px-2 py-1 mb-2 rounded" value={feedbackSubject} onChange={(e) => setFeedbackSubject(e.target.value)} />
            <textarea placeholder="Message" className="w-full border px-2 py-1 mb-2 rounded" value={feedbackMessage} onChange={(e) => setFeedbackMessage(e.target.value)} />
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400" onClick={() => setFeedbackModal({ open: false })}>
                Cancel
              </button>
              <button className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white" onClick={sendFeedback}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <Message />
    </div>
  );
};

export default LabManager;
