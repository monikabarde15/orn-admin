import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Award, Download, Share2, ArrowLeft } from "lucide-react";
import logoimg from "../../../public/assets/orllogo.png";
import { useNavigate } from "react-router-dom";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";

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
const navigate = useNavigate();

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
    <>
     <Navbar />
     <div className="min-h-screen bg-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
                <button
        onClick={() => navigate("/certificate")}
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
              className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40"
            >
              <Download size={18} /> Download
            </button>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">

          {/* LEFT : PDF */}
          <div className="bg-white rounded-xl h-[57vh] overflow-hidden">
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
          <div className="bg-slate-800 rounded-xl p-4 space-y-6 overflow-y-auto">
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
    height: "794px",
    backgroundColor: "#0b1220",
    padding: "20px",
    fontFamily: "'Poppins', Arial, sans-serif",
    boxSizing: "border-box",
  }}
>
  {/* OUTER BLUE FRAME */}
  <div
    style={{
      width: "100%",
      height: "100%",
      background:
        "linear-gradient(135deg, #0f172a 0%, #0b3c7a 50%, #0f172a 100%)",
      padding: "30px",
      boxSizing: "border-box",
    }}
  >
    {/* INNER WHITE CARD */}
    <div
      style={{
        backgroundColor: "#ffffff",
        width: "100%",
        height: "100%",
        padding: "50px 70px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* LOGO */}
      <img
        src={CERTIFICATE_LOGO}
        alt="Logo"
        style={{ width: "160px", marginBottom: "30px" }}
      />

      {/* TITLE */}
      <h1
        style={{
          fontSize: "46px",
          margin: "0",
          color: "#0f172a",
          letterSpacing: "1px",
        }}
      >
        CERTIFICATE
      </h1>

      <h3
        style={{
          marginTop: "8px",
          fontSize: "18px",
          letterSpacing: "3px",
          color: "#2563eb",
          fontWeight: 500,
        }}
      >
        OF COMPLETION
      </h3>

      <p style={{ marginTop: "30px", fontSize: "16px", color: "#334155" }}>
        This certifies that
      </p>

      {/* USER NAME */}
      <h2
        style={{
          fontSize: "40px",
          margin: "10px 0 20px",
          color: "#020617",
          fontWeight: 700,
        }}
      >
        {user.name}
      </h2>

      <p style={{ fontSize: "16px", color: "#334155", maxWidth: "600px" }}>
        has successfully completed the course
      </p>

      {/* COURSE TITLE */}
      <h3
        style={{
          fontSize: "22px",
          marginTop: "10px",
          fontWeight: 600,
          color: "#020617",
        }}
      >
        “{certificate.title}”
      </h3>

      {/* META INFO */}
      <div
        style={{
          marginTop: "40px",
          fontSize: "14px",
          color: "#334155",
          lineHeight: "1.8",
        }}
      >
        <p>
          <b>Certificate ID:</b> {certificate.id}
        </p>
        <p>
          <b>Issued On:</b> {certificate.issue_date}
        </p>
        <p>
          <b>Expiry:</b> {certificate.expiry_date || "Lifetime"}
        </p>
        <p>
          <b>Status:</b> Active
        </p>
      </div>

      {/* SIGNATURE */}
      <div
        style={{
          position: "absolute",
          bottom: "60px",
          left: "70px",
        }}
      >
        <div
          style={{
            width: "200px",
            borderTop: "2px solid #0f172a",
            marginBottom: "6px",
          }}
        />
        <p style={{ fontWeight: 600, color: "#020617", margin: 0 }}>
          Authorized Signature
        </p>
        <p style={{ fontSize: "13px", color: "#475569", margin: 0 }}>
          OnRequestLab LMS
        </p>
      </div>

      {/* FOOTER */}
      <p
        style={{
          position: "absolute",
          bottom: "40px",
          right: "70px",
          fontSize: "13px",
          color: "#475569",
        }}
      >
        Verified & Issued by <b>OnRequestLab</b>
      </p>
    </div>
  </div>
</div>
    </div>
     <Footer />
    </>
    
  );
};

export default CertificateView;
