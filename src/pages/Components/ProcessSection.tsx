import React from "react";

const steps = [
  {
    title: "Discovery & Research",
    desc: "We dive deep into your business, audience, and competitors to understand what makes you unique.",
    icon: (
      <svg height="32" width="32" fill="none">
        <rect width="32" height="32" rx="8" fill="#5033C3"/>
        <path d="M20 21.41L15.59 17A5 5 0 1117 15.59L21.41 20A1 1 0 0120 21.41ZM13 18a4 4 0 100-8 4 4 0 000 8z" fill="#fff"/>
      </svg>
    ),
    color: "#A683F8"
  },
  {
    title: "Strategy Development",
    desc: "Our team creates a customized marketing strategy tailored to your goals and target audience.",
    icon: (
      <svg height="32" width="32" fill="none">
        <rect width="32" height="32" rx="8" fill="#5033C3"/>
        <path d="M16 23V9M16 23V9M16 9L19 12M16 9L13 12" stroke="#fff" strokeWidth="2"/>
      </svg>
    ),
    color: "#A683F8"
  },
  {
    title: "Campaign Execution",
    desc: "We bring your campaign to life with compelling content, strategic distribution, and precise timing.",
    icon: (
      <svg height="32" width="32" fill="none">
        <rect width="32" height="32" rx="8" fill="#5033C3"/>
        <path d="M16 18v-6M16 22a6 6 0 100-12 6 6 0 000 12z" fill="#fff"/>
      </svg>
    ),
    color: "#A683F8"
  },
  {
    title: "Optimize & Scale",
    desc: "Continuous monitoring and optimization ensure maximum ROI as we scale what works best.",
    icon: (
      <svg height="32" width="32" fill="none">
        <rect width="32" height="32" rx="8" fill="#5033C3"/>
        <path d="M10 22v-7M16 22v-3M22 22V13" stroke="#fff" strokeWidth="2"/>
      </svg>
    ),
    color: "#A683F8"
  },
];

export default function ProcessSection() {
  return (
    <div style={{
      background: "radial-gradient(ellipse 80% 100% at 50% 0%, #1A1432 90%, #181026 100%)",
      color: "#fff",
      minHeight: "100vh",
      padding: "48px 0",
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <h5 style={{
          color: "#A683F8",
          letterSpacing: "2.5px",
          fontWeight: 600,
          fontSize: 16,
          marginBottom: 18
        }}>
          Testimonials
        </h5>
        <h2 style={{
          marginBottom: 12,
          fontWeight: 700,
          fontSize: 48,
          lineHeight: 1.1
        }}>
          How We Create <span
            style={{
              background: "linear-gradient(90deg,#A683F8,#43D4FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>Success</span>
        </h2>
        <p style={{
          color: "#b7b7c7",
          fontSize: 18,
          marginBottom: 48,
          fontWeight: 400
        }}>
          A proven methodology that transforms ideas into measurable results.
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: "32px",
          marginTop: "30px"
        }}>
          {steps.map((step, idx) => (
            <div key={idx} style={{
              border: "1px solid rgba(166,131,248,0.17)",
              boxShadow: "0 2px 24px 0 rgba(80,51,195,0.18)",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.01)",
              padding: "32px 18px 28px",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                top: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                background: step.color,
                borderRadius: "50%",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 12px 0 rgba(166,131,248,0.25)"
              }}>
                {step.icon}
                <span style={{
                  position: "absolute",
                  top: "4px",
                  right: "8px",
                  fontWeight: 700,
                  color: "#fff",
                  fontSize: 12,
                  background: "#5033C3",
                  borderRadius: "50%",
                  padding: "2px 6px"
                }}>{String(idx + 1).padStart(2, "0")}</span>
              </div>
              <h4 style={{
                marginTop: 30,
                marginBottom: 10,
                fontWeight: 600,
                fontSize: 19
              }}>
                {step.title}
              </h4>
              <p style={{
                color: "#b7b7c7",
                fontSize: 15,
                fontWeight: 400,
                margin: 0
              }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
