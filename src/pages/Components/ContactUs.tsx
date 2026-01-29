import React, { useState } from "react";
import "../../pages/Components/ContactUs.css";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import countryList from "country-list-with-dial-code-and-flag";

console.log(import.meta.env.VITE_API_URL);
const VIT=import.meta.env.VITE_API_URL;
const countryCodes = countryList.getAll().map((c) => ({
    dialCode: c.dialCode,
    name: c.name,
    code: c.countryCode,
  }));

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

  const [countryCode, setCountryCode] = useState("+91");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ----------------- VALIDATION -------------------
  const validate = () => {
    const newErrors: any = {};

    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required.";

    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required.";

    if (!formData.email.trim())
      newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email.";

    if (!formData.phone.trim())
      newErrors.phone = "Phone is required.";
    else if (!/^\d{7,15}$/.test(formData.phone))
      newErrors.phone = "Phone must contain 7–15 digits.";

    if (!formData.message.trim())
      newErrors.message = "Message is required.";
    else if (formData.message.length < 10)
      newErrors.message = "Message must be at least 10 characters.";

    return newErrors;
  };

  // ----------------- SUBMIT -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${VIT}/api/contact/submit/`,
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
            phone: `${countryCode}${formData.phone}`,
            message: formData.message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Something went wrong!");
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
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------- UI -------------------
  return (
    <section className="contactus-section max-w-7xl mx-auto" id="contact">
      <ToastContainer position="top-right" autoClose={3000} />

      <motion.div
        className="contactus-header"
        initial="hidden"
        whileInView="visible"
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
          className="contactus-form"
          onSubmit={handleSubmit}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6, delay: 0.2 }}
          variants={fadeUp}
        >
          {/* FIRST + LAST NAME */}
          <div className="contact-row">
            <div className="contact-field">
              <label>First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
              />
              {errors.first_name && <p className="error-text">{errors.first_name}</p>}
            </div>

            <div className="contact-field">
              <label>Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
              />
              {errors.last_name && <p className="error-text">{errors.last_name}</p>}
            </div>
          </div>

          {/* EMAIL */}
          <div className="contact-field">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          {/* PHONE + COUNTRY CODE */}
          <div className="contact-field">
            <label>Phone</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: "#4845a5ff",
                  width: "150px",
                }}
              >
                {countryCodes.map((c, i) => (
                  <option key={i} value={c.dialCode}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                style={{ flex: 1 }}
              />
            </div>

            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>

          {/* MESSAGE */}
          <div className="contact-field">
            <label>Message</label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            ></textarea>
            {errors.message && <p className="error-text">{errors.message}</p>}
          </div>

          {/* SUBMIT */}
          <button className="contactus-btn" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"} {!loading && "→"}
          </button>
        </motion.form>

        {/* RIGHT-SIDE CONTACT INFO */}
        <motion.div
          className="contactus-info"
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6, delay: 0.4 }}
          variants={fadeUp}
        >
          <div className="contactus-info-card">
            <div className="info-icon-wrapper email-icon">
              ✉️
            </div>
            <div>
              <div className="contactus-info-label">Email</div>
              <div className="contactus-info-text">support@onrequestlab.com</div>
            </div>
          </div>

          <div className="contactus-info-card">
            <div className="info-icon-wrapper phone-icon">📞</div>
            <div>
              <div className="contactus-info-label">Phone</div>
              <div className="contactus-info-text">+91 8383092074</div>
            </div>
          </div>

          <div className="contactus-info-card">
            <div className="info-icon-wrapper location-icon">📍</div>
            <div>
              <div className="contactus-info-label">Office</div>
              <div className="contactus-info-text">
                NO.95, 9th Cross, Kaveri Block, Sai Shakthi Layout,
                Mylasandra, Bangalore -560068
              </div>
            </div>
          </div>

          <div className="ready-card">
            <h3 className="ready-card-title">Signup</h3>
            <p className="ready-card-text">
              Join 250+ companies already growing with PrismDigital.
            </p>
            <a href="/register">
              <button className="ready-card-btn">
                Schedule a Free Consultation
              </button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactUs;
