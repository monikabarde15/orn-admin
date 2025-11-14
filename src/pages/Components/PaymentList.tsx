import React, { useEffect, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

const API_URL = "https://backend.onrequestlab.com/api/v1/admin/payments/";
const ROWS_PER_PAGE = 5;

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Get cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };
  const accessToken = getCookie("access");

  // Fetch payments
  const fetchPayments = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}?page=${page}`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        withCredentials: true,
      });
      const items = res.data.results || [];
      const total = res.data.count || items.length;

      setPayments(items);
      setFilteredPayments(items);
      setTotalItems(total);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(currentPage);
  }, []);

  // Search/filter
  useEffect(() => {
    setFilteredPayments(
      payments.filter(
        (p) =>
          (p.order_id || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (p.payment_id || "")
            .toLowerCase()
            .includes(search.toLowerCase())
      )
    );
  }, [search, payments]);

  // Pagination buttons
  const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE);
  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchPayments(page);
  };

  // Export table to CSV
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

  // Export table to PDF
  const exportPDF = () => {
    const element = document.createElement("table");
    element.innerHTML = `
      <thead>
        <tr>
          <th>ID</th>
          <th>Order ID</th>
          <th>Payment ID</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Refund ID</th>
          <th>Refund Status</th>
          <th>Created At</th>
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

  // Print / Download invoice
  const handleInvoice = async (id, action) => {
    try {
      const res = await axios.get(`${API_URL}${id}/`, {
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
        <p><strong>Created At:</strong> ${new Date(p.created_at).toLocaleString()}</p>
      `;

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
    } catch (err) {
      console.error("Invoice fetch error:", err);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search payments..."
          className="form-input py-2 px-3 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="btn btn-sm btn-primary" onClick={exportCSV}>
            Export CSV
          </button>
          <button className="btn btn-sm btn-primary" onClick={exportPDF}>
            Export PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-striped table-hover w-full" id="dataTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Order ID</th>
              <th>Payment ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Refund ID</th>
              <th>Refund Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4 text-muted">
                  No records found
                </td>
              </tr>
            ) : (
              filteredPayments.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.order_id}</td>
                  <td>{p.payment_id || "-"}</td>
                  <td>{p.amount}</td>
                  <td>{p.status}</td>
                  <td>{p.refund_id || "-"}</td>
                  <td>{p.refund_status || "-"}</td>
                  <td>{new Date(p.created_at).toLocaleString()}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-1" onClick={() => handleInvoice(p.id, "print")}>
                      Print
                    </button>
                    <button className="btn btn-sm btn-success" onClick={() => handleInvoice(p.id, "download")}>
                      PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-1 flex-wrap">
          <button className="btn btn-sm btn-outline-primary" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => changePage(page)}
            >
              {page}
            </button>
          ))}
          <button className="btn btn-sm btn-outline-primary" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentList;
