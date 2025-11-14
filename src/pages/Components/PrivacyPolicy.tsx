import React from "react";
import { Mail, Phone, MapPin, Download, Printer } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";
import "../Components/PrivacyPolicy.css";

export default function PrivacyPolicy() {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.12 * i, duration: 0.55, ease: "easeOut" },
    }),
  };

  return (
    <>
      <Navbar />

      {/* Animated background container */}
      <section className="refundp-bg-section">
        <div className="refundp-bg" aria-hidden="true" />

        <div className="refundp-root">
          <div className="refundp-headerbar">
            <h1 className="refundp-title">Privacy Policy</h1>
            <div className="refundp-actions">
              <button className="refundp-btn">
                <Download size={16} /> Download PDF
              </button>
              <button className="refundp-btn">
                <Printer size={16} /> Print Policy
              </button>
            </div>
          </div>

          <div className="refundp-cards">
            {[
              {
                header: "Eligibility for Refunds",
                content: (
                  <ul>
                    <li>
                      Refunds issued under{" "}
                      <span className="refundp-accent">specific conditions</span> only.
                    </li>
                    <li>
                      Requests must be made within{" "}
                      <span className="refundp-accent">3 days</span> of purchase.
                    </li>
                    <li>No refunds after 3 days or for minor personal preferences.</li>
                  </ul>
                ),
              },
              {
                header: "Refund Process",
                content: (
                  <ul>
                    <li>
                      Email{" "}
                      <span className="refundp-accent">Contact@onrequestlab.com</span> with order details.
                    </li>
                    <li>Request reviewed within 3 business days.</li>
                    <li>Approved refunds processed within 7 days.</li>
                  </ul>
                ),
              },
              {
                header: "Our Commitment",
                content: (
                  <div>
                    <strong>Customer satisfaction is our priority.</strong> Contact us for any issues.
                  </div>
                ),
              },
              {
                header: "Contact Us",
                content: (
                  <div className="refundp-contacts">
                    <div className="refundp-contact-tile">
                      <Mail size={20} />
                      <span>Contact@onrequestlab.com</span>
                    </div>
                    <div className="refundp-contact-tile">
                      <Phone size={20} />
                      <span>+91 9876543210</span>
                    </div>
                    <div className="refundp-contact-tile">
                      <MapPin size={20} />
                      <span>123 Digital Lane, Mumbai, India</span>
                    </div>
                  </div>
                ),
              },
            ].map((section, idx) => (
              <motion.article
                className="refundp-card"
                key={section.header}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={cardVariants}
                tabIndex={0}
              >
                <div className="refundp-card-header">{section.header}</div>
                <div className="refundp-card-content">{section.content}</div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
