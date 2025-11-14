import React, { useEffect, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import Swal from "sweetalert2";

const API_URL = "https://backend.onrequestlab.com/api/v1/admin/users/";
const ROWS_PER_PAGE = 5;

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };
  const accessToken = getCookie("access");

  // Fetch all users once (if API supports pagination, you can modify)
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        withCredentials: true,
      });
      const items = res.data.results || [];
      setUsers(items);
      setFilteredUsers(items);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search/filter users
  useEffect(() => {
    const filtered = users.filter(
      (u) =>
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.last_name?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // reset to first page when searching
  }, [search, users]);

  // Pagination data
  const totalPages = Math.ceil(filteredUsers.length / ROWS_PER_PAGE);
  const indexOfLast = currentPage * ROWS_PER_PAGE;
  const indexOfFirst = indexOfLast - ROWS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Delete user
  const deleteUser = async (user) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}${user.id}/`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        withCredentials: true,
      });
      const updated = users.filter((u) => u.id !== user.id);
      setUsers(updated);
      Swal.fire({
        icon: "success",
        toast: true,
        position: "top",
        title: "User deleted!",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      console.error("Delete failed:", err);
      Swal.fire({
        icon: "error",
        toast: true,
        position: "top",
        title: "Failed to delete user",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  // Toggle Active/Inactive
  const toggleActive = async (user) => {
    try {
      await axios.patch(
        `${API_URL}${user.id}/`,
        { is_active: !user.is_active },
        {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
          withCredentials: true,
        }
      );
      fetchUsers();
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  // CSV Export
  const exportCSV = () => {
    const headers = [
      "ID",
      "Username",
      "Email",
      "First Name",
      "Last Name",
      "Date Joined",
      "Active",
    ];
    let csv = headers.join(",") + "\n";
    filteredUsers.forEach((u) => {
      csv +=
        [
          u.id,
          u.username,
          u.email,
          u.first_name || "-",
          u.last_name || "-",
          new Date(u.date_joined).toLocaleString(),
          u.is_active ? "Active" : "Inactive",
        ].join(",") + "\n";
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "UsersList.csv";
    a.click();
  };

  // PDF Export
  const exportPDF = () => {
    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th><th>Username</th><th>Email</th><th>First Name</th><th>Last Name</th><th>Date Joined</th><th>Active</th>
        </tr>
      </thead>
      <tbody>
        ${filteredUsers
          .map(
            (u) => `<tr>
              <td>${u.id}</td>
              <td>${u.username}</td>
              <td>${u.email}</td>
              <td>${u.first_name || "-"}</td>
              <td>${u.last_name || "-"}</td>
              <td>${new Date(u.date_joined).toLocaleString()}</td>
              <td>${u.is_active ? "Active" : "Inactive"}</td>
            </tr>`
          )
          .join("")}
      </tbody>
    `;
    html2pdf()
      .set({
        margin: 10,
        filename: "UsersList.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "pt", format: "a4", orientation: "landscape" },
      })
      .from(table)
      .save();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search users..."
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
        <table className="table table-striped table-hover w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Date Joined</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : currentUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-muted">
                  No users found
                </td>
              </tr>
            ) : (
              currentUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.first_name || "-"}</td>
                  <td>{u.last_name || "-"}</td>
                  <td>{new Date(u.date_joined).toLocaleString()}</td>
                  <td>
                    <button
                      className={`btn btn-sm ${
                        u.is_active ? "btn-success" : "btn-warning"
                      }`}
                      onClick={() => toggleActive(u)}
                    >
                      {u.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td>
                   <button
                    className={`btn btn-sm ${
                      u.id < 2 ? "btn-secondary opacity-50 cursor-not-allowed" : "btn-danger"
                    }`}
                    onClick={() => deleteUser(u)}
                    disabled={u.id < 2}
                  >
                    Delete
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
          <button
            className="btn btn-sm btn-outline-primary"
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`btn btn-sm ${
                currentPage === page
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => changePage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="btn btn-sm btn-outline-primary"
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersList;
