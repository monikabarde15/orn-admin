import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Award, Download, Share2, ArrowLeft } from "lucide-react";
import logoimg from "../../../public/assets/orllogo.png";

const CERTIFICATE_LOGO = logoimg;

/* ================= TYPES ================= */
interface Certificate {
  id: string;
  title: string;
  issue_date: string;
  expiry_date: string | null;
  created_at: string;
  is_active: boolean;
}

const CertificateView: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();

  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  /* ================= HELPERS ================= */
  const getCookie = (name: string) => {
    if (typeof document === "undefined") return "";
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift();
    return "";
  };

  const user = {
    name: getCookie("username") || "Learner",
    email: getCookie("email"),
  };

  /* ================= AUTH ================= */
  const token =
    document.cookie
      .split("; ")
      .find((r) => r.startsWith("access="))
      ?.split("=")[1] || localStorage.getItem("access");

  const api = axios.create({
    baseURL: "https://dev.backend.onrequestlab.com",
    headers: { Authorization: `Bearer ${token}` },
  });

  /* ================= FETCH CERTIFICATE ================= */
  useEffect(() => {
    if (!certificateId) return;

    api
      .get(`/certificate/certificate/${certificateId}/`)
      .then((res) => setCertificate(res.data))
      .finally(() => setLoading(false));
  }, [certificateId]);

  /* ================= GENERATE PDF ================= */
  const generatePdf = async () => {
    const element = document.getElementById("certificate-html");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "px", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  useEffect(() => {
    if (certificate) generatePdf();
  }, [certificate]);

  /* ================= ACTIONS ================= */
  const downloadPdf = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "Certificate-of-Completion.pdf";
    a.click();
  };

  const shareCertificate = async () => {
    if (!pdfUrl) return;

    if (navigator.share) {
      await navigator.share({
        title: "Certificate of Completion",
        text: certificate?.title,
        url: pdfUrl,
      });
    } else {
      await navigator.clipboard.writeText(pdfUrl);
      alert("Certificate PDF link copied!");
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return <div className="p-10 text-center text-white">Loading certificate...</div>;
  }

  if (!certificate) {
    return <div className="p-10 text-center text-white">Certificate not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-slate-300"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <div className="flex gap-3">
            <button
              onClick={shareCertificate}
              className="bg-slate-700 px-4 py-2 rounded flex items-center gap-2"
            >
              <Share2 size={18} /> Share
            </button>

            <button
              onClick={downloadPdf}
              className="bg-green-600 px-4 py-2 rounded flex items-center gap-2"
            >
              <Download size={18} /> Download
            </button>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT : PDF */}
          <div className="bg-white rounded-xl h-[85vh] overflow-hidden">
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                title="Certificate PDF"
                className="w-full h-full border-none"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-black">
                Generating certificate...
              </div>
            )}
          </div>

          {/* RIGHT : DETAILS */}
          <div className="bg-slate-800 rounded-xl p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center gap-3">
              <Award className="text-yellow-400" size={42} />
              <div>
                <h2 className="text-2xl font-bold">{certificate.title}</h2>
                <p className="text-slate-400">
                  Issued on {certificate.issue_date}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <div>
                <b className="text-white">Certificate ID:</b>
                <p className="break-all">{certificate.id}</p>
              </div>

              <div>
                <b className="text-white">Issued To:</b> {user.name}
              </div>

              <div>
                <b className="text-white">Status:</b>{" "}
                {certificate.is_active ? "Active" : "Inactive"}
              </div>

              <div>
                <b className="text-white">Expiry:</b>{" "}
                {certificate.expiry_date || "Lifetime"}
              </div>

              <div>
                <b className="text-white">Created At:</b>{" "}
                {new Date(certificate.created_at).toLocaleString()}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700 text-sm text-slate-400">
               This certification verifies that the above-named learner has completed all
    required learning modules, instructional videos, reading materials, and
    mandatory assessments associated with this course. The learner appeared for
    the final evaluation and achieved the qualifying score as defined by the
    assessment criteria of the program.
            </div>
          </div>
        </div>
      </div>

      {/* ================= HIDDEN CERTIFICATE HTML ================= */}
      <div
        id="certificate-html"
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          width: "1123px",
          padding: "60px",
          backgroundColor: "#ffffff",
          fontFamily: "Georgia, serif",
          color: "#000",
          border: "14px solid #1e3a8a",
        }}
      >
        <img
          src={CERTIFICATE_LOGO}
          alt="Logo"
          style={{ width: "140px", margin: "0 auto 30px", display: "block" }}
        />

        <h1 style={{ textAlign: "center", fontSize: "42px" }}>
          Certificate of Completion & Verification
        </h1>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          This certificate is proudly presented to
        </p>

        <h2 style={{ textAlign: "center", fontSize: "36px", fontWeight: "bold" }}>
          {user.name}
        </h2>

        <p style={{ textAlign: "center" }}>
          for successfully completing the course
        </p>

        <h3 style={{ textAlign: "center", fontSize: "26px" }}>
          {certificate.title}
        </h3>

        <div style={{ marginTop: "40px", border: "2px solid #1e3a8a", padding: "30px" }}>
          <p><b>Certificate ID:</b> {certificate.id}</p>
          <p><b>Issued On:</b> {certificate.issue_date}</p>
          <p><b>Expiry:</b> {certificate.expiry_date || "Lifetime"}</p>
          <p><b>Status:</b> Active</p>
        </div>

        <p style={{ textAlign: "center", marginTop: "40px" }}>
          Verified & issued by <b>OnRequestLab LMS</b>
        </p>
      </div>
    </div>
  );
};

export default CertificateView;
