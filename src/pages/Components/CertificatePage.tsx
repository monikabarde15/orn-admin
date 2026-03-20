import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const API_BASE = import.meta.env.VITE_API_URL;

const notify = (msg, type = "info") =>
  toast[type](msg, { position: "top-center", autoClose: 2500 });

export default function CertificatePage() {

  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 6;

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  /* ================= AUTH ================= */
  const token = localStorage.getItem("access_token");
  const userId = localStorage.getItem("userId");

  const authHeader = {
    Authorization: `Bearer ${token}`,
  };

  /* ================= STATE ================= */
  const [certificates, setCertificates] = useState([]);

  const [form, setForm] = useState({
    id: null,
    title: "",
    issue_date: "",
    expiry_date: "",
    is_active: true,
    file: null,
  });

  /* ================= FETCH ================= */
  const fetchCertificates = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/certificate/certificate/`,
        { headers: authHeader }
      );

      setCertificates(res.data || []);
    } catch {
      notify("Failed to load certificates", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async () => {
    if (!form.title) return notify("Title required", "warning");

    try {
      if (form.id) {

        await api.patch(
          `/certificate/certificate/${form.id}/`,
          {
            title: form.title,
            issue_date: form.issue_date,
            expiry_date: form.expiry_date,
            is_active: form.is_active,
          },
          { headers: authHeader }
        );

        notify("Certificate updated", "success");

      } else {

        if (!form.file)
          return notify("Certificate file required", "warning");

        const fd = new FormData();
        fd.append("certificate", form.file);
        fd.append("title", form.title);
        fd.append("issue_date", form.issue_date);
        fd.append("expiry_date", form.expiry_date);
        fd.append("is_active", form.is_active);

        await api.post(
          `/certificate/certificate/`,
          fd,
          {
            headers: {
              ...authHeader,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        notify("Certificate added", "success");
      }

      setForm({
        id: null,
        title: "",
        issue_date: "",
        expiry_date: "",
        is_active: true,
        file: null,
      });

      fetchCertificates();

    } catch {
      notify("Save failed", "error");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {

    if (!window.confirm("Delete certificate?")) return;

    try {
      await api.delete(
        `certificate/certificate/${id}/`,
        { headers: authHeader }
      );

      notify("Certificate deleted", "success");
      fetchCertificates();

    } catch {
      notify("Delete failed", "error");
    }
  };

  const totalPages = Math.ceil(certificates.length / ITEMS_PER_PAGE);

  const paginatedCertificates = certificates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ================= UI ================= */
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#020617] text-white px-6 py-16">

        <ToastContainer />

        <h1 className="text-4xl font-semibold text-center mb-8">
          🎓 My Certificate Management
        </h1>

        {/* 🔵 LOADER */}
        {loading ? (

          <div className="flex justify-center items-center h-[300px]">

            <div className="w-14 h-14 border-4 border-[#7b4dff] border-t-transparent rounded-full animate-spin"></div>

          </div>

        ) : (

          <>
            {/* ===== LIST ===== */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

              {paginatedCertificates.map((c) => (

                <div
                  key={c.id}
                  className="relative rounded-2xl border border-white/10 
                  bg-gradient-to-b from-[#0f172a] to-[#020617]
                  p-6 shadow-xl hover:shadow-purple-500/20
                  transition-all duration-300"
                >

                  <h3 className="text-2xl font-semibold mb-2">
                    {c.title}
                  </h3>

                  <div className="text-sm text-gray-400 space-y-1 mb-4">
                    <p>Issue Date: {c.issue_date || "—"}</p>
                    <p>Expiry Date: {c.expiry_date || "—"}</p>
                  </div>

                  <div className="mb-6">
                    <span
                      className={`inline-block px-3 py-1 text-xs rounded-full
                      ${c.is_active
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                        }`}
                    >
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/certificate-view/${c.id}`)}
                    className="w-full mb-4 py-3 rounded-xl font-medium
                    bg-gradient-to-r from-purple-500 to-blue-500
                    hover:opacity-90 transition"
                  >
                    View Certificate
                  </button>

                </div>

              ))}

            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (

              <div className="flex justify-center items-center gap-3 mt-12">

                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-4 py-2 rounded-lg border border-white/10 disabled:opacity-40 hover:bg-white/10"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => {

                  const page = i + 1;

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg border
                        ${currentPage === page
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 border-transparent"
                          : "border-white/10 hover:bg-white/10"
                        }`}
                    >
                      {page}
                    </button>
                  );

                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-4 py-2 rounded-lg border border-white/10 disabled:opacity-40 hover:bg-white/10"
                >
                  Next
                </button>

              </div>

            )}

          </>
        )}

      </div>

      <Footer />
    </>
  );
}