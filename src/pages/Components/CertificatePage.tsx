import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from './Navbar';
import Footer from './Footer';

const API_BASE = import.meta.env.VITE_API_URL;

const notify = (msg, type = "info") =>
  toast[type](msg, { position: "top-center", autoClose: 2500 });

export default function CertificatePage() {
  /* ================= AUTH ================= */
  const getCookie = (name) => {
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return "";
  };

  const token =
    getCookie("access") || localStorage.getItem("token") || "";

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
      const res = await axios.get(
        `${API_BASE}/certificate/certificate/`,
        { headers: authHeader }
      );
      setCertificates(res.data || []);
    } catch {
      notify("Failed to load certificates", "error");
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
        // UPDATE
        await axios.patch(
          `${API_BASE}/certificate/certificate/${form.id}/`,
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
        // CREATE
        if (!form.file)
          return notify("Certificate file required", "warning");

        const fd = new FormData();
        fd.append("certificate", form.file);
        fd.append("title", form.title);
        fd.append("issue_date", form.issue_date);
        fd.append("expiry_date", form.expiry_date);
        fd.append("is_active", form.is_active);

        await axios.post(
          `${API_BASE}/certificate/certificate/`,
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
      await axios.delete(
        `${API_BASE}/certificate/certificate/${id}/`,
        { headers: authHeader }
      );
      notify("Certificate deleted", "success");
      fetchCertificates();
    } catch {
      notify("Delete failed", "error");
    }
  };

  /* ================= VIEW (NEW TAB) ================= */
  const handleView = (cert) => {
    if (!cert.certificate_file) {
      notify("Certificate file not found", "error");
      return;
    }

    const fileUrl = cert.certificate_file.startsWith("http")
      ? cert.certificate_file
      : `https://${cert.certificate_file}`;

    // ✅ Open in new tab
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  /* ================= DOWNLOAD (LOCAL) ================= */
  const handleDownload = (cert) => {
    if (!cert.certificate_file) {
      notify("Certificate file not found", "error");
      return;
    }

    const fileUrl = cert.certificate_file.startsWith("http")
      ? cert.certificate_file
      : `https://${cert.certificate_file}`;

    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = `${cert.title || "certificate"}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  /* ================= UI ================= */
  return (
    <>
        <Navbar />
        <div className="min-h-screen bg-[#020617] text-white px-6 py-16">
        <ToastContainer />

        <h1 className="text-4xl font-semibold text-center mb-8">
            🎓 Certificate Management
        </h1>

        {/* ===== FORM ===== */}
        <div className="max-w-xl mx-auto mb-10 bg-white/5 p-6 rounded-xl">
            <input
            placeholder="Title"
            className="w-full mb-2 p-2 bg-black/30 border"
            value={form.title}
            onChange={(e) =>
                setForm({ ...form, title: e.target.value })
            }
            />

            <input
            type="date"
            className="w-full mb-2 p-2 bg-black/30 border"
            value={form.issue_date}
            onChange={(e) =>
                setForm({ ...form, issue_date: e.target.value })
            }
            />

            <input
            type="date"
            className="w-full mb-2 p-2 bg-black/30 border"
            value={form.expiry_date}
            onChange={(e) =>
                setForm({ ...form, expiry_date: e.target.value })
            }
            />

            {!form.id && (
            <input
                type="file"
                accept=".pdf"
                className="w-full mb-3"
                onChange={(e) =>
                setForm({ ...form, file: e.target.files[0] })
                }
            />
            )}

            <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 py-2 rounded"
            >
            {form.id ? "Update" : "Add"} Certificate
            </button>
        </div>

        {/* ===== LIST ===== */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            {certificates.map((c) => (
            <div key={c.id} className="p-5 border rounded">
                <h3 className="font-semibold">{c.title}</h3>

                <p className="text-sm text-gray-400">
                Issue: {c.issue_date}
                </p>
                <p className="text-sm text-gray-400">
                Expiry: {c.expiry_date}
                </p>

                <p
                className={`text-sm ${
                    c.is_active ? "text-emerald-400" : "text-red-400"
                }`}
                >
                Status: {c.is_active ? "Active" : "Inactive"}
                </p>

                <div className="mt-3 flex gap-2 flex-wrap">
                <button onClick={() => handleView(c)}>View</button>
                <button onClick={() => handleDownload(c)}>Download</button>
                <button onClick={() => setForm(c)}>Edit</button>
                <button onClick={() => handleDelete(c.id)}>Delete</button>
                </div>
            </div>
            ))}
        </div>
        </div>
        <Footer />
    </>
    
  );
}
