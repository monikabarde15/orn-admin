import React from "react";
import "../Components/OfferService.css";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Master High-Availability Clusters",
    desc: "Learn to create, manage, and troubleshoot high-availability clusters to minimize downtime and ensure seamless operations.",
    number: "01",
    icon: (
      <svg viewBox="0 0 38 38" width="38" height="38">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="38" y2="38">
            <stop stopColor="#7e55fa" />
            <stop offset="1" stopColor="#53d1e0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" rx="14" width="38" height="38" fill="url(#g1)" />
        <circle cx="16.5" cy="17" r="6.2" stroke="#fff" strokeWidth="2" fill="none" />
        <line x1="27" y1="27" x2="22.2" y2="22.2" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Automate and Optimize",
    desc: "Gain expertise in automating cluster and resource deployment, along with accessing and managing storage effectively.",
    number: "02",
    icon: (
      <svg viewBox="0 0 38 38" width="38" height="38">
        <defs>
          <linearGradient id="g2" x1="0" y1="0" x2="38" y2="38">
            <stop stopColor="#53d1e0" />
            <stop offset="1" stopColor="#7e55fa" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" rx="14" width="38" height="38" fill="url(#g2)" />
        <path d="M10 20h18M19 10v18" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Enhance Reliability",
    desc: "Understand how to configure LVM in clusters and eliminate single points of failure to achieve enterprise-grade reliability.",
    number: "03",
    icon: (
      <svg viewBox="0 0 38 38" width="38" height="38">
        <defs>
          <linearGradient id="g3" x1="0" y1="0" x2="38" y2="38">
            <stop stopColor="#ff7a7a" />
            <stop offset="1" stopColor="#ffb347" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" rx="14" width="38" height="38" fill="url(#g3)" />
        <polygon points="10,28 19,10 28,28" fill="none" stroke="#fff" strokeWidth="2" />
      </svg>
    ),
  },
];

const categories = [
  {
    name: "Pacemaker 3 node Linux cluster",
    color: "rgba(249, 199, 79, 0.15)",
    iconColor: "#F9C74F",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.84-.41 1.684-.287 2.489.107.711.327 1.419.671 2.086l.003-.001c1.634 3.163 6.993 4.065 10.324 1.977 1.96-1.228 3.327-3.113 3.967-5.173.64-2.06.49-4.218-.416-6.05l-.062-.13c-.823-1.687-2.326-2.837-3.784-3.586-1.458-.749-2.998-1.192-4.5-1.472z"/>
      </svg>
    )
  },
  {
    name: "Docker",
    color: "rgba(239, 71, 111, 0.15)",
    iconColor: "#EF476F",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11.25 3.75l-8.5 8.5 8.5 8.5M12.75 3.75l8.5 8.5-8.5 8.5"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </svg>
    )
  },
  {
    name: "Terraform",
    color: "rgba(6, 174, 213, 0.15)",
    iconColor: "#06AED5",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 2.18l6 2.25v4.66c0 4.23-2.88 8.17-6 9.14-3.12-.97-6-4.91-6-9.14V6.43l6-2.25z"/>
      </svg>
    )
  },
  {
    name: "Kubernates",
    color: "rgba(17, 138, 178, 0.15)",
    iconColor: "#118AB2",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
      </svg>
    )
  },
  {
    name: "Linux Administration",
    color: "rgba(138, 201, 38, 0.15)",
    iconColor: "#8AC926",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
        <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
      </svg>
    )
  },
  {
    name: "Python",
    color: "rgba(255, 159, 28, 0.15)",
    iconColor: "#FF9F1C",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3v18h18M7 16l4-4 3 3 5-7"/>
        <circle cx="7" cy="16" r="1.5" fill="currentColor"/>
        <circle cx="11" cy="12" r="1.5" fill="currentColor"/>
        <circle cx="14" cy="15" r="1.5" fill="currentColor"/>
        <circle cx="19" cy="8" r="1.5" fill="currentColor"/>
      </svg>
    )
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const ProcessSection = () => (
  <section className="process-section" id="process">
    <motion.div
      className="process-header"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      variants={fadeUp}
    >
      <span className="process-sub">Course We Offer</span>
      <h2 className="process-title">
        Pacemaker - <span className="gradient-text">Linux</span> Cluster Labs
      </h2>
    </motion.div>

    <div className="process-grid-wrapper">
      <div className="process-bg-line"></div>
      <div className="process-grid max-w-7xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            className="process-card"
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            custom={i}
            variants={fadeUp}
          >
            <div className="process-card-top">
              <span className="icon-badge-wrapper">
                {step.icon}
                <span className="process-badge">{step.number}</span>
              </span>
            </div>
            <div className="process-card-title text-center">{step.title}</div>
            <div className="process-card-desc text-center">{step.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Category Buttons Section */}
    <motion.div
      className="category-buttons-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      variants={fadeUp}
      style={{
        marginTop: "1rem",
        marginBottom: "3rem",
        padding: "0 1.5rem"
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* First Row - 4 buttons */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginBottom: "1rem"
        }}>
          {categories.slice(0, 4).map((category, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 10px 30px rgba(126, 85, 250, 0.2)",
                borderColor: "rgba(126, 85, 250, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: "1.75rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.875rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                backdropFilter: "blur(10px)"
              }}
            >
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: category.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: category.iconColor,
                transition: "transform 0.3s ease"
              }}>
                {category.icon}
              </div>
              <span style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#e0e0e0"
              }}>
                {category.name}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Second Row - 4 buttons */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem"
        }}>
          {categories.slice(4).map((category, idx) => (
            <motion.button
              key={idx + 4}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 10px 30px rgba(126, 85, 250, 0.2)",
                borderColor: "rgba(126, 85, 250, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: "1.75rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.875rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                backdropFilter: "blur(10px)"
              }}
            >
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: category.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: category.iconColor,
                transition: "transform 0.3s ease"
              }}>
                {category.icon}
              </div>
              <span style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#e0e0e0"
              }}>
                {category.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  </section>
);

export default ProcessSection;