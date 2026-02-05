import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const VIT = import.meta.env.VITE_API_URL;

/* ================= TYPES ================= */

interface Instance {
  user_instance_id: string;
  instance_type: string;
  instance_name?: string;
  instance_ip?: string;
  status: string;
  web_ssh_url?: string;
  timestamp?: string;
  isDeleted?: boolean;
}

/* ================= HELPERS ================= */

const extractPackageFromName = (name?: string): string => {
  if (!name) return "linux";
  const lower = name.toLowerCase();

  if (lower.includes("nodea") || lower.includes("nodeb") || lower.includes("nodec"))
    return "redhat";
  if (lower.includes("kubernetes") || lower.includes("k8s"))
    return "kubernetes";
  if (lower.includes("docker")) return "docker";
  if (lower.includes("terraform")) return "terraform";
  if (lower.includes("jenkins")) return "jenkins";
  if (lower.includes("python")) return "python";
  if (lower.includes("iscsi")) return "iscsi";
  if (lower.includes("linux")) return "linux";

  return "linux";
};

/* ================= DOC MAP ================= */

const DOCS_MAP: Record<string, string> = {
  kubernetes: `${VIT}/learn/kubernetes/`,
  redhat: `${VIT}/learn/redhat/`,
  docker: `${VIT}/learn/docker/`,
  linux: `${VIT}/learn/linux/`,
  iscsi: `${VIT}/learn/iscsi/`,
  python: `${VIT}/learn/python/`,
  jenkins: `${VIT}/learn/jenkins/`,
  terraform: `${VIT}/learn/terraform/`,
};

/* ================= COMPONENT ================= */

const LabDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [instance, setInstance] = useState<Instance | null>(null);
  const [loading, setLoading] = useState(true);
  const [leftWidth, setLeftWidth] = useState(70);

  const isResizing = useRef(false);

  /* ================= AUTH (NO COOKIES) ================= */

  const token = localStorage.getItem("access_token");
  const userId = localStorage.getItem("userId");

  /* ================= FETCH INSTANCE ================= */

  useEffect(() => {
    const fetchInstance = async () => {
      if (!token || !userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/api/v1/lab/userinst/${userId}/`);
        const instances: Instance[] = res.data || [];

        // ✅ latest non-deleted instance
        const activeInstance =
          instances
            .filter((i) => i.isDeleted !== true)
            .sort(
              (a, b) =>
                new Date(b.timestamp || "").getTime() -
                new Date(a.timestamp || "").getTime()
            )[0] || null;

        setInstance(activeInstance);
      } catch (err) {
        console.error("Error fetching instance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstance();
  }, [token, userId]);

  /* ================= RESIZE LOGIC ================= */

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;

      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 30 && newWidth < 80) {
        setLeftWidth(newWidth);
      }
    };

    const stopResize = () => {
      isResizing.current = false;
      document.body.style.cursor = "default";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResize);
    };
  }, []);

  const startResize = () => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
  };

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-gray-300">
        Loading lab...
      </div>
    );
  }

  if (!instance) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-gray-300">
        No active lab found
      </div>
    );
  }

  /* ================= DYNAMIC DOC ================= */

  const packageName = extractPackageFromName(instance.instance_name);
  const tutorialSrc = DOCS_MAP[packageName];
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
      }}
    >
      {/* 🔙 BACK BUTTON */}
      <div style={{ position: "fixed", top: 12, left: 12, zIndex: 1000 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "#000",
            color: "#fff",
            border: "1px solid #444",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
      </div>

      {/* 📘 LEFT PANEL – DOCS */}
      <div
        style={{
          width: `${leftWidth}%`,
          backgroundColor: "#fff",
          borderRight: "2px solid #2d2d2d",
          display: "flex",
        }}
      >
        <iframe
          src={tutorialSrc}
          title="Documentation"
          style={{ flex: 1, border: "none" }}
        />
      </div>

      {/* ↔ DRAG BAR */}
      <div
        onMouseDown={startResize}
        style={{
          width: "6px",
          cursor: "col-resize",
          backgroundColor: "#444",
        }}
      />

      {/* 💻 RIGHT PANEL – SSH */}
      <div
        style={{
          width: `${100 - leftWidth}%`,
          backgroundColor: "#1e1e1e",
          display: "flex",
        }}
      >
        <iframe
          src={sshUrl}
          title="Web SSH"
          style={{ flex: 1, border: "none" }}
        />
      </div>
    </div>
  );
};

export default LabDashboard;
