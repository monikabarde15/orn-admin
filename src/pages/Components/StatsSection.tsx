import React, { useEffect, useState } from "react";
import { Server, BookOpen, Users } from "lucide-react";

export default function StatsSection() {

  const statsData = [
    { value: 5, label: "Numbers Of Lab", icon: <Server size={28} /> },
    { value: 5, suffix: "+", label: "Number Of Course", icon: <BookOpen size={28} /> },
  ];

  const [counts, setCounts] = useState(statsData.map(() => 0));

  // 🔥 visits logic
  const [visits, setVisits] = useState(5000);        // real value
  const [displayVisits, setDisplayVisits] = useState(5000); // UI default

  // 🔥 normal counters animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prev) =>
        prev.map((count, i) => {
          const target = statsData[i].value;
          const step = Math.ceil(target / 30);
          return count < target ? count + step : target;
        })
      );
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // 🔥 daily +3000 increase
  useEffect(() => {
    const interval = setInterval(() => {
      setVisits((prev) => {
        const newVal = prev + 3000;
        setDisplayVisits(newVal);
        return newVal;
      });
    }, 86400000); // 24 hours

    return () => clearInterval(interval);
  }, []);

  // 🔥 number format (3000 → 3k+)
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + "k+";
    }
    return num;
  };

  return (
    <section style={sectionStyle}>
      
      {/* HEADER */}
      <div style={{ marginBottom: "clamp(30px,5vw,50px)" }}>
        <span style={badgeStyle}>COMPANY STATS</span>

        <h2 style={titleStyle}>
          The Foundation of Our Success
        </h2>
      </div>

      {/* GRID */}
      <div style={gridStyle}>

        {/* LAB + COURSE */}
        {statsData.map((item, i) => (
          <div
            key={i}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(139,92,246,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={iconStyle}>{item.icon}</div>

            <h3 style={numberStyle}>
              {counts[i]}
              {item.suffix || ""}
            </h3>

            <p style={labelStyle}>{item.label}</p>
          </div>
        ))}

        {/* 🔥 VISITS CARD */}
        <div
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(139,92,246,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={iconStyle}>
            <Users size={28} />
          </div>

          <h3 style={numberStyle}>
            {formatNumber(displayVisits)}
          </h3>

          <p style={labelStyle}>User Visit Every Day</p>
        </div>

      </div>
    </section>
  );
}

/* ================= RESPONSIVE STYLES ================= */

const sectionStyle = {
  background: "radial-gradient(circle at top, #1a1333, #0b0620)",
  padding: "clamp(40px, 8vw, 80px) 20px",
  color: "#fff",
  textAlign: "center",
};

const badgeStyle = {
  background: "rgba(139, 92, 246, 0.2)",
  color: "#c4b5fd",
  padding: "6px 14px",
  borderRadius: "20px",
  fontSize: "12px",
  display: "inline-block",
  marginBottom: "12px",
};

const titleStyle = {
  fontSize: "clamp(24px, 5vw, 42px)",
  fontWeight: "700",
  lineHeight: "1.2",
  background: "linear-gradient(90deg, #fff, #a78bfa)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "clamp(12px, 3vw, 20px)",
  maxWidth: "1100px",
  margin: "0 auto",
};

const cardStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(139, 92, 246, 0.2)",
  padding: "clamp(18px, 4vw, 30px)",
  borderRadius: "16px",
  backdropFilter: "blur(10px)",
  transition: "0.3s",
  cursor: "pointer",
  minHeight: "140px",
};

const iconStyle = {
  marginBottom: "10px",
  color: "#a78bfa",
  display: "flex",
  justifyContent: "center",
};

const numberStyle = {
  fontSize: "clamp(20px, 5vw, 32px)",
  fontWeight: "700",
  color: "#a78bfa",
};

const labelStyle = {
  fontSize: "clamp(11px, 2.5vw, 13px)",
  letterSpacing: "1px",
  marginTop: "6px",
  opacity: 0.8,
};