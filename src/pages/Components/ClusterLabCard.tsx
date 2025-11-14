import React, { useEffect } from "react";
import { motion } from "framer-motion";
import "../Components/ClusterLabCard.css";
import { useNavigate } from "react-router-dom";

export default function ClusterLabSection() {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    const accessToken =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token") ||
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("access="))
        ?.split("=")[1];

    if (accessToken) {
      navigate("/apps/LabListNormal"); // ✅ safe (in click handler)
    } else {
      navigate("/login"); // ✅ safe (in click handler)
    }
  };

  return (
    <section className="cluster-split-section" id="pricing">
      <motion.div
        className="cluster-left"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="animated-orb"></div>
        <div className="floating-ring"></div>
        <div className="glow-particle"></div>
      </motion.div>

      <motion.div
        className="cluster-right"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>Pacemaker - Cluster Labs With 3 Nodes (WebSSH)</h1>
        <p>
          Pacemaker High-Availability cluster improves the availability and
          reliability of critical services.
        </p>
        <div className="price-tag">₹ 100.00</div>
        <div className="cluster-card-rating">
          <span className="stars">★★★★★</span>
          <span className="reviews">(120 Reviews)</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="cluster-btn"
          onClick={handleBuyNow}
        >
          Buy Now
        </motion.button>
      </motion.div>
    </section>
  );
}
