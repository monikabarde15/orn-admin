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
  instance_name?: string;
}

const LabDashboard: React.FC = () => {
  const location = useLocation();
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

  // Fetch Instance
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
          instances.find((i) => i.status === "Launched") ||
          instances[0];

        setInstance(active || null);
      } catch (err) {
        console.error("Error fetching instance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstance();
  }, [userId, token]);

  // Resizing Logic
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

  const extractTypeFromName = (name = "") => {
    const parts = name.split("-");
    return parts.length >= 2 ? parts[1] : "unknown"; // "linux"
  };

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
const instanceTnew=instance.instance_type;
  const instanceType =
    extractTypeFromName(instance.instance_name || "") ||
    instance.instance_type ||
    "container";

  console.log("instance=", instance.instance_name, "instanceType=", instanceType,'instanceTnew=',instanceTnew);

  // ------------------------------
  // FIXED: define tutorialUrls ONCE
  // ------------------------------
  
 // Mapping dictionary
const tutorialUrls: Record<string, string> = {
  terraform: "https://backend.onrequestlab.com/learn/terraform/",
};

// tutorialSrc should be let (not const)
let tutorialSrc = "";

// 1️⃣ Special case → linux from instanceName
if (instanceType === "linux") {
  tutorialSrc = "https://backend.onrequestlab.com/learn/linux/";
}

// 2️⃣ VM → kubernetes
else if (instance.instance_name !== "nodea" && instance.instance_name !== "iscsiclient" && instanceTnew === "VM") {
  tutorialSrc = "https://backend.onrequestlab.com/learn/kubernetes/";
}

else if(instance.instance_name === "nodea" && instanceTnew === "VM"){
  tutorialSrc = "https://backend.onrequestlab.com/learn/redhat/";

}else if (instance.instance_name === "iscsiclient" && instanceTnew === "VM") {
  tutorialSrc = "https://backend.onrequestlab.com/learn/terraform/";
}
// 3️⃣ NODE → docker
else if (instanceTnew === "NODE") {
  tutorialSrc = "https://backend.onrequestlab.com/learn/docker/";
}

// 4️⃣ dictionary fallback if still empty
else if (tutorialUrls[instanceType]) {
  tutorialSrc = tutorialUrls[instanceType];
} 
else if (tutorialUrls[instanceTnew]) {
  tutorialSrc = tutorialUrls[instanceTnew];
}

// SSH URL
const sshUrl = instance.web_ssh_url || "";

console.log("tutorialSrc =", tutorialSrc);

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
      {/* Left Panel - Tutorial */}
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

      {/* Divider */}
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

      {/* Right Panel - Terminal */}
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
