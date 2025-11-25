import React, { useEffect, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import Message from "../MessagesList";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const ROWS_PER_PAGE = 5;

const PaymentListNormal = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const accessToken = getCookie("access");
  const userid = getCookie("user_id");

  const fetchPayments = async (page = 1) => {
    if (!userid) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://dev.backend.onrequestlab.com/api/v1/users/payments/${userid}/`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        withCredentials: true,
      });
      const items = res.data || [];
      setPayments(items);
      setFilteredPayments(items);
      setTotalItems(items.length);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching payments:", err);
      alert("Failed to fetch payments. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [accessToken]);

  useEffect(() => {
    setFilteredPayments(
      payments.filter(
        (p) =>
          (p.order_id || "").toLowerCase().includes(search.toLowerCase()) ||
          (p.payment_id || "").toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, payments]);

  const exportCSV = () => {
    const csv = [
      ["ID", "Order ID", "Payment ID", "Amount", "Status", "Refund ID", "Refund Status", "Created At"],
      ...filteredPayments.map((p) => [
        p.id,
        p.order_id,
        p.payment_id || "-",
        p.amount,
        p.status,
        p.refund_id || "-",
        p.refund_status || "-",
        new Date(p.created_at).toLocaleString(),
      ]),
    ]
      .map((row) => row.map((col) => `"${col}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Payments_Table.csv";
    a.click();
  };

  const exportPDF = () => {
    const element = document.createElement("table");
    element.innerHTML = `
      <thead>
        <tr>
          <th>ID</th><th>Order ID</th><th>Payment ID</th><th>Amount</th><th>Status</th>
          <th>Refund ID</th><th>Refund Status</th><th>Created At</th>
        </tr>
      </thead>
      <tbody>
        ${filteredPayments
          .map(
            (p) => `
          <tr>
            <td>${p.id}</td>
            <td>${p.order_id}</td>
            <td>${p.payment_id || "-"}</td>
            <td>${p.amount}</td>
            <td>${p.status}</td>
            <td>${p.refund_id || "-"}</td>
            <td>${p.refund_status || "-"}</td>
            <td>${new Date(p.created_at).toLocaleString()}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    `;

    html2pdf()
      .set({
        margin: 10,
        filename: "Payments_Table.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "pt", format: "a4", orientation: "landscape" },
      })
      .from(element)
      .save();
  };

  const handleInvoice = async (paymentId, action) => {
    if (!paymentId) return alert("Payment ID missing!");
    try {
      const res = await axios.get(`https://dev.backend.onrequestlab.com/api/v1/users/payment-detail/${paymentId}/`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        withCredentials: true,
      });
      const p = res.data;

      const element = document.createElement("div");
      element.style.padding = "20px";
      element.innerHTML = `
        <h2 style="text-align:center;">Invoice #${p.id}</h2>
        <p><strong>Order ID:</strong> ${p.order_id}</p>
        <p><strong>Payment ID:</strong> ${p.payment_id || '-'}</p>
        <p><strong>Amount:</strong> ${p.amount}</p>
        <p><strong>Status:</strong> ${p.status}</p>
        <p><strong>Refund ID:</strong> ${p.refund_id || '-'}</p>
        <p><strong>Refund Status:</strong> ${p.refund_status || '-'}</p>
        <p><strong>Payment Method:</strong> ${p.payment_method || '-'}</p>
        <p><strong>Created At:</strong> ${new Date(p.created_at).toLocaleString()}</p>
      `;

      document.body.appendChild(element);

      if (action === "print") {
        const w = window.open("", "", "width=700,height=700");
        w.document.write("<html><head><title>Invoice</title></head><body>" + element.innerHTML + "</body></html>");
        w.document.close();
        w.focus();
        w.print();
      } else {
        html2pdf()
          .set({
            margin: 10,
            filename: `Invoice_${p.id}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
          })
          .from(element)
          .save();
      }

      document.body.removeChild(element);
    } catch (err) {
      console.error("Error fetching payment detail:", err);
      alert("Failed to fetch payment details.");
    }
  };

  const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE);
  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchPayments(page);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-white mb-6 border-b pb-2 border-indigo-500">
            Payment History
          </h2>

          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search payments..."
              className="w-full sm:w-64 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-900 text-white placeholder-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" onClick={exportCSV}>
                Export CSV
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={exportPDF}>
                Export PDF
              </button>
            </div>
          </div>

         <div className="overflow-x-auto bg-slate-900 rounded-lg shadow-lg">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-indigo-600 text-gray-100"> {/* header text light gray */}
                    <tr>
                      <th className="px-4 py-2 border-r border-indigo-500 text-gray-800">ID</th>
                      <th className="px-4 py-2 border-r border-indigo-500 text-gray-800">Order ID</th>
                      <th className="px-4 py-2 border-r border-indigo-500 text-gray-800">Payment ID</th>
                      <th className="px-4 py-2 border-r border-indigo-500 text-gray-800">Amount</th>
                      <th className="px-4 py-2 border-r border-indigo-500 text-gray-800">Status</th>
                      <th className="px-4 py-2 border-r border-indigo-500 text-gray-800">Refund ID</th>
                      <th className="px-4 py-2 border-r border-indigo-500 text-gray-800">Refund Status</th>
                      <th className="px-4 py-2 text-gray-800">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4 text-gray-200">Loading...</td>
                      </tr>
                    ) : filteredPayments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4 text-gray-400">No records found</td>
                      </tr>
                    ) : (
                      filteredPayments.map((p, idx) => (
                        <tr key={idx} className="border-b border-gray-700 hover:bg-gray-800">
                          <td className="px-4 py-2 text-gray-100">{p.id}</td>
                          <td className="px-4 py-2 text-gray-100">{p.order_id}</td>
                          <td className="px-4 py-2 text-gray-100">{p.payment_id || "-"}</td>
                          <td className="px-4 py-2 text-gray-100">{p.amount}</td>
                          <td className="px-4 py-2 text-gray-100">{p.status}</td>
                          <td className="px-4 py-2 text-gray-100">{p.refund_id || "-"}</td>
                          <td className="px-4 py-2 text-gray-100">{p.refund_status || "-"}</td>
                          <td className="px-4 py-2 text-gray-100">{new Date(p.created_at).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>



          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2 flex-wrap">
              <button
                className="px-3 py-1 border rounded text-white border-indigo-500 hover:bg-indigo-600 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => changePage(currentPage - 1)}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`px-3 py-1 border rounded text-white ${
                    currentPage === page
                      ? "bg-indigo-600 border-indigo-600"
                      : "border-indigo-500 hover:bg-indigo-600"
                  }`}
                  onClick={() => changePage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="px-3 py-1 border rounded text-white border-indigo-500 hover:bg-indigo-600 disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => changePage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}

          <Message />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentListNormal;
