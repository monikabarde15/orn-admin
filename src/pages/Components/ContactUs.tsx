import React, { useState } from "react";
import "../../pages/Components/ContactUs.css";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const ContactUs = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Local frontend validation
  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required.";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required.";
    if (!formData.email.trim())
      newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address.";
    if (!formData.phone.trim())
      newErrors.phone = "Phone number is required.";
    else if (!/^\d{7,10}$/.test(formData.phone))
      newErrors.phone = "Phone must contain only digits (max 10).";
    if (!formData.message.trim())
      newErrors.message = "Message is required.";
    else if (formData.message.length < 10)
      newErrors.message = "Message must be at least 10 characters long.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await fetch(
        "https://backend.onrequestlab.com/api/contact/submit/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            user: "1",
            subject: "Contact Query",
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const backendErrors = {};

        // ✅ Handle backend validation messages
        if (data.message && typeof data.message === "object") {
          Object.keys(data.message).forEach((key) => {
            backendErrors[key] = data.message[key][0];
          });
        } else if (typeof data.message === "string") {
          toast.error(data.message);
        } else {
          toast.error("Something went wrong!");
        }

        setErrors(backendErrors);
      } else {
        toast.success("✓ Message sent successfully!");
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          message: "",
        });
        setErrors({});
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contactus-section max-w-7xl mx-auto" id="contact">
      <ToastContainer position="top-right" autoClose={3000} />

      <motion.div
        className="contactus-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        variants={fadeUp}
      >
        <span className="contactus-sub">GET IN TOUCH</span>
        <h2 className="contactus-title">
          Let's Create Something <span className="gradient-text">Amazing</span>
        </h2>
        <p className="contactus-desc">
          Ready to transform your digital presence? Get in touch with our team today.
        </p>
      </motion.div>

      <div className="contactus-grid max-w-7xl mx-auto">
        <motion.form
          onSubmit={handleSubmit}
          className="contactus-form"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          variants={fadeUp}
        >
          <div className="contact-row">
            <div className="contact-field">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                placeholder="John"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
              />
              {errors.first_name && (
                <p className="error-text">{errors.first_name}</p>
              )}
            </div>

            <div className="contact-field">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                placeholder="Doe"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
              />
              {errors.last_name && (
                <p className="error-text">{errors.last_name}</p>
              )}
            </div>
          </div>

          <div className="contact-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="john@company.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="contact-field">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="9876543210"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>

          <div className="contact-field">
            <label>Message</label>
            <textarea
              name="message"
              placeholder="Tell us about your project..."
              rows={3}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            ></textarea>
            {errors.message && <p className="error-text">{errors.message}</p>}
          </div>

          <button className="contactus-btn" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}{" "}
            {!loading && <span style={{ fontWeight: "bold" }}>→</span>}
          </button>
        </motion.form>

        {/* Info Section with Icons */}
        <motion.div
          className="contactus-info"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          variants={fadeUp}
        >
          <div className="contactus-info-card">
            <div className="info-icon-wrapper email-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <div>
              <div className="contactus-info-label">Email</div>
              <div className="contactus-info-text">support@onrequestlab.com</div>
            </div>
          </div>

          <div className="contactus-info-card">
            <div className="info-icon-wrapper phone-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div>
              <div className="contactus-info-label">Phone</div>
              <div className="contactus-info-text">+91 (838) 309-7074</div>
            </div>
          </div>

          <div className="contactus-info-card">
            <div className="info-icon-wrapper location-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <div className="contactus-info-label">Office</div>
              <div className="contactus-info-text">
                NO.95, 9th Cross, kaveri Block Sai Shakthi Layout, Mylasandra, Bangalore -560068
              </div>
            </div>
          </div>

          {/* Ready to Get Started Card */}
          <div className="ready-card">
            <h3 className="ready-card-title">Signup</h3>
            <p className="ready-card-text">
              Join 250+ companies already growing with PrismDigital. Let's discuss
              how we can help your business thrive.
            </p>
            <a href="auth/boxed-signup">
            <button className="ready-card-btn">
              Schedule a Free Consultation
            </button></a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactUs;
