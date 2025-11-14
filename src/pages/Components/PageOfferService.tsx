import React from "react";
import "../Components/OfferService.css";
import { motion } from "framer-motion";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

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
//   {
//     title: "Launch & Optimization",
//     desc: "We deploy, monitor performance, and optimize continuously for growth and scalability.",
//     number: "04",
//     icon: (
//       <svg viewBox="0 0 38 38" width="38" height="38">
//         <defs>
//           <linearGradient id="g4" x1="0" y1="0" x2="38" y2="38">
//             <stop stopColor="#53e0b9" />
//             <stop offset="1" stopColor="#7e55fa" />
//           </linearGradient>
//         </defs>
//         <rect x="0" y="0" rx="14" width="38" height="38" fill="url(#g4)" />
//         <path d="M10 20l8-8 8 8M19 12v14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
//       </svg>
//     ),
//   },
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

const PageOfferService = () => (
<>
 <Navbar />
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
      {/* <p className="process-desc">
        A proven methodology that transforms ideas into measurable results.
      </p> */}
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
  </section>
  <Footer />
</>
);

export default PageOfferService;
