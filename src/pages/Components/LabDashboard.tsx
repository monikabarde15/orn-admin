import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://backend.onrequestlab.com/api/v1";

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
  const [instance, setInstance] = useState<Instance | null>(null);
  const [loading, setLoading] = useState(true);
  const [leftWidth, setLeftWidth] = useState(70); // %
  const isResizing = useRef(false);

  const query = new URLSearchParams(location.search);
  const userId = query.get("user");

  const token =
    localStorage.getItem("jwt-auth") || localStorage.getItem("access") || "";

  // ✅ Fetch instance only when userId + token exist
  useEffect(() => {
    const fetchInstance = async () => {
      if (!userId || !token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/lab/userinst/${userId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  // ✅ Resizing logic always runs (hooks order fixed)
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

  // ✅ Conditional rendering happens AFTER hooks
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

  const ip = instance.instance_ip || "N/A";
  const username = instance.userName || instance.AccessKeyId || "root";
  const password =
    instance.AccessKeyId || instance.SecretAccessKey || "lab123";
  const instanceType = instance.instance_type || "container";

  const tutorialSrc =
    instanceType === "aws"
      ? "https://backend.onrequestlab.com/learn/aws/"
      : instanceType === "iscsi"
      ? "https://backend.onrequestlab.com/learn/iscsi/"
      : "https://backend.onrequestlab.com/learn/docker/";

  const sshUrl =
    instance.web_ssh_url

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
      {/* ✅ Left Panel - Tutorial */}
      <div
        style={{
          width: `${leftWidth}%`,
          backgroundColor: "#fff",
          borderRight: "2px solid #2d2d2d",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.1s ease-out",
        }}
      >
        <iframe
          src={tutorialSrc}
          title="Tutorial"
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      </div>

      {/* ✅ Draggable Divider */}
      <div
        onMouseDown={startResizing}
        style={{
          width: "6px",
          cursor: "col-resize",
          backgroundColor: "#444",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) =>
          ((e.target as HTMLDivElement).style.backgroundColor = "#666")
        }
        onMouseLeave={(e) =>
          ((e.target as HTMLDivElement).style.backgroundColor = "#444")
        }
      ></div>

      {/* ✅ Right Panel - WebSSH */}
      <div
        style={{
          width: `${100 - leftWidth}%`,
          backgroundColor: "#1e1e1e",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <iframe
          src={sshUrl}
          title="WebSSH Terminal"
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      </div>
    </div>
  );
};

export default LabDashboard;
