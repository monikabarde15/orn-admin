import React, { useEffect, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

const API_URL = "https://backend.onrequestlab.com/api/v1/admin/instances/";
const ROWS_PER_PAGE = 5;

const LabList = () => {
  const [instances, setInstances] = useState([]);
  const [filteredInstances, setFilteredInstances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Get access token from cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };
  const accessToken = getCookie("access");

  // Fetch instances
  const fetchInstances = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}?page=${page}`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        withCredentials: true,
      });

      const items = res.data.results || [];
      const total = res.data.count || items.length;

      setInstances(items);
      setFilteredInstances(items);
      setTotalItems(total);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching instances:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstances(currentPage);
  }, []);

  // Search/filter
  useEffect(() => {
    setFilteredInstances(
      instances.filter((i) =>
        i.userName?.toLowerCase().includes(search.toLowerCase()) ||
        i.instance_type?.toLowerCase().includes(search.toLowerCase()) ||
        i.instance_ip?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, instances]);

  // Pagination
  const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE);
  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchInstances(page);
  };

  // Delete instance
  const deleteInstance = async (id) => {
    if (!window.confirm("Are you sure you want to delete this instance?")) return;
    try {
      await axios.delete(`${API_URL}${id}/`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        withCredentials: true,
      });
      alert("Instance deleted successfully!");
      fetchInstances(currentPage);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete instance.");
    }
  };

  // CSV export
  const exportCSV = () => {
    const headers = [
      "ID","User Name","Instance Type","Instance Size","User ID","IP","Status","Processing","Deleted","Comments","Hours","Rent Date","Timestamp"
    ];
    let csv = headers.join(",") + "\n";
    filteredInstances.forEach((i) => {
      csv += [
        i.user_instance_id,
        i.userName,
        i.instance_type,
        i.instance_size,
        i.userId,
        i.instance_ip,
        i.status,
        i.processing_status ? "Yes" : "No",
        i.isDeleted ? "Yes" : "No",
        i.comments || "-",
        i.hours,
        new Date(i.rentDate).toLocaleString(),
        new Date(i.timestamp).toLocaleString()
      ].join(",") + "\n";
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "LabList.csv";
    a.click();
  };

  // PDF export
  const exportPDF = () => {
    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th>
          <th>User Name</th>
          <th>Instance Type</th>
          <th>Instance Size</th>
          <th>User ID</th>
          <th>IP</th>
          <th>Status</th>
          <th>Processing</th>
          <th>Deleted</th>
          <th>Comments</th>
          <th>Hours</th>
          <th>Rent Date</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        ${filteredInstances
          .map(
            (i) => `
          <tr>
            <td>${i.user_instance_id}</td>
            <td>${i.userName}</td>
            <td>${i.instance_type}</td>
            <td>${i.instance_size}</td>
            <td>${i.userId}</td>
            <td>${i.instance_ip}</td>
            <td>${i.status}</td>
            <td>${i.processing_status ? "Yes" : "No"}</td>
            <td>${i.isDeleted ? "Yes" : "No"}</td>
            <td>${i.comments || "-"}</td>
            <td>${i.hours}</td>
            <td>${new Date(i.rentDate).toLocaleString()}</td>
            <td>${new Date(i.timestamp).toLocaleString()}</td>
          </tr>`
          )
          .join("")}
      </tbody>
    `;
    html2pdf()
      .set({ margin: 10, filename: "LabList.pdf", html2canvas: { scale: 2 }, jsPDF: { unit: "pt", format: "a4", orientation: "landscape" } })
      .from(table)
      .save();
  };

  // SSH button
  const openSSH = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search instances..."
          className="form-input py-2 px-3 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="btn btn-sm btn-primary" onClick={exportCSV}>Export CSV</button>
          <button className="btn btn-sm btn-primary" onClick={exportPDF}>Export PDF</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-striped table-hover w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>User Name</th>
              <th>Instance Type</th>
              <th>Instance Size</th>
              <th>User ID</th>
              <th>IP</th>
              <th>Status</th>
              <th>Processing</th>
              <th>Deleted</th>
              <th>Comments</th>
              <th>Hours</th>
              <th>Rent Date</th>
              <th>Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={14} className="text-center py-4">Loading...</td></tr>
            ) : filteredInstances.length === 0 ? (
              <tr><td colSpan={14} className="text-center py-4">No records found</td></tr>
            ) : (
              filteredInstances.map((i) => (
                <tr key={i.user_instance_id}>
                  <td>{i.user_instance_id}</td>
                  <td>{i.userName}</td>
                  <td>{i.instance_type}</td>
                  <td>{i.instance_size}</td>
                  <td>{i.userId}</td>
                  <td>{i.instance_ip}</td>
                  <td>{i.status}</td>
                  <td>{i.processing_status ? "Yes" : "No"}</td>
                  <td>{i.isDeleted ? "Yes" : "No"}</td>
                  <td>{i.comments || "-"}</td>
                  <td>{i.hours}</td>
                  <td>{new Date(i.rentDate).toLocaleString()}</td>
                  <td>{new Date(i.timestamp).toLocaleString()}</td>
                  <td className="flex gap-1 flex-wrap">
                    <button className="btn btn-sm btn-danger" onClick={() => deleteInstance(i.user_instance_id)}>Delete</button>
                    {i.web_ssh_url && <button className="btn btn-sm btn-warning" onClick={() => openSSH(i.web_ssh_url)}>SSH</button>}
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
          <button className="btn btn-sm btn-outline-primary" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button key={page} className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-outline-primary"}`} onClick={() => changePage(page)}>{page}</button>
          ))}
          <button className="btn btn-sm btn-outline-primary" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default LabList;
