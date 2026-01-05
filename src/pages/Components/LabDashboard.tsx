import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://dev.backend.onrequestlab.com/api/v1";

interface Instance {
  user_instance_id: string;
  instance_type: string;
  instance_ip?: string;
  status: string;
  web_ssh_url?: string;
  userName?: string;
  secret_key?: string;
  AccessKeyId?: string;
  SecretAccessKey?: string;
}

const LabDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [instance, setInstance] = useState<Instance | null>(null);
  const [loading, setLoading] = useState(true);
  const [leftWidth, setLeftWidth] = useState(70);
  const isResizing = useRef(false);

  const query = new URLSearchParams(location.search);
  const userId = query.get("user");

  const token =
    localStorage.getItem("jwt-auth") ||
    localStorage.getItem("access") ||
    "";

  /* ================= FETCH INSTANCE ================= */

  useEffect(() => {
    const fetchInstance = async () => {
      if (!userId || !token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(
          `${API_BASE}/lab/userinst/${userId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const instances: Instance[] = res.data || [];
        const active =
          instances.find((i) => i.status === "Launched") || instances[0];

        setInstance(active || null);
      } catch (err) {
        console.error("Error fetching instance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstance();
  }, [userId, token]);

  /* ================= RESIZE LOGIC ================= */

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const newLeftWidth = (e.clientX / window.innerWidth) * 100;
      if (newLeftWidth > 30 && newLeftWidth < 80) {
        setLeftWidth(newLeftWidth);
      }
    };

    const stopResizing = () => {
      isResizing.current = false;
      document.body.style.cursor = "default";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResizing);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, []);

  const startResizing = () => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
  };

  /* ================= CONDITIONAL RENDER ================= */

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-300 bg-black">
        Loading...
      </div>
    );

  if (!instance)
    return (
      <div className="flex items-center justify-center h-screen text-gray-300 bg-black">
        No active instance
      </div>
    );

  const instanceType = instance.instance_type || "container";

  const tutorialSrc =
    instanceType === "aws"
      ? "https://dev.backend.onrequestlab.com/learn/aws/"
      : instanceType === "iscsi"
      ? "https://dev.backend.onrequestlab.com/learn/iscsi/"
      : "https://dev.backend.onrequestlab.com/learn/docker/";

  const sshUrl = instance.web_ssh_url || "";

  /* ================= UI ================= */

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#111",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* 🔙 TOP BACK BUTTON */}
      <div
        style={{
          position: "fixed",
          top: "12px",
          left: "12px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "#000",
            color: "#fff",
            border: "1px solid #444",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          ← Back
        </button>
      </div>

      {/* LEFT PANEL */}
      <div
        style={{
          width: `${leftWidth}%`,
          backgroundColor: "#fff",
          borderRight: "2px solid #2d2d2d",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <iframe
          src={tutorialSrc}
          title="Tutorial"
          style={{ flex: 1, border: "none" }}
        />
      </div>

      {/* DRAG BAR */}
      <div
        onMouseDown={startResizing}
        style={{
          width: "6px",
          cursor: "col-resize",
          backgroundColor: "#444",
        }}
      ></div>

      {/* RIGHT PANEL */}
      <div
        style={{
          width: `${100 - leftWidth}%`,
          backgroundColor: "#1e1e1e",
          display: "flex",
        }}
      >
        <iframe
          src={sshUrl}
          title="WebSSH"
          style={{ flex: 1, border: "none" }}
        />
      </div>
    </div>
  );
};

export default LabDashboard;
