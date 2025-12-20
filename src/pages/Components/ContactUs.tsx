import React, { useState } from "react";
import "../../pages/Components/ContactUs.css";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import countryList from "country-list-with-dial-code-and-flag";

// ⭐ 100% Working Country Code Data

// const countryCodes = [
//   { name: "Afghanistan", dial_code: "+93", code: "AF" },
//   { name: "Albania", dial_code: "+355", code: "AL" },
//   { name: "Algeria", dial_code: "+213", code: "DZ" },
//   { name: "Andorra", dial_code: "+376", code: "AD" },
//   { name: "Angola", dial_code: "+244", code: "AO" },
//   { name: "Argentina", dial_code: "+54", code: "AR" },
//   { name: "Armenia", dial_code: "+374", code: "AM" },
//   { name: "Australia", dial_code: "+61", code: "AU" },
//   { name: "Austria", dial_code: "+43", code: "AT" },
//   { name: "Azerbaijan", dial_code: "+994", code: "AZ" },
//   { name: "Bahamas", dial_code: "+1-242", code: "BS" },
//   { name: "Bahrain", dial_code: "+973", code: "BH" },
//   { name: "Bangladesh", dial_code: "+880", code: "BD" },
//   { name: "Belarus", dial_code: "+375", code: "BY" },
//   { name: "Belgium", dial_code: "+32", code: "BE" },
//   { name: "Belize", dial_code: "+501", code: "BZ" },
//   { name: "Benin", dial_code: "+229", code: "BJ" },
//   { name: "Bhutan", dial_code: "+975", code: "BT" },
//   { name: "Bolivia", dial_code: "+591", code: "BO" },
//   { name: "Bosnia", dial_code: "+387", code: "BA" },
//   { name: "Botswana", dial_code: "+267", code: "BW" },
//   { name: "Brazil", dial_code: "+55", code: "BR" },
//   { name: "Bulgaria", dial_code: "+359", code: "BG" },
//   { name: "Cambodia", dial_code: "+855", code: "KH" },
//   { name: "Cameroon", dial_code: "+237", code: "CM" },
//   { name: "Canada", dial_code: "+1", code: "CA" },
//   { name: "Chile", dial_code: "+56", code: "CL" },
//   { name: "China", dial_code: "+86", code: "CN" },
//   { name: "Colombia", dial_code: "+57", code: "CO" },
//   { name: "Costa Rica", dial_code: "+506", code: "CR" },
//   { name: "Croatia", dial_code: "+385", code: "HR" },
//   { name: "Cuba", dial_code: "+53", code: "CU" },
//   { name: "Cyprus", dial_code: "+357", code: "CY" },
//   { name: "Czech Republic", dial_code: "+420", code: "CZ" },
//   { name: "Denmark", dial_code: "+45", code: "DK" },
//   { name: "Dominican Republic", dial_code: "+1-809", code: "DO" },
//   { name: "Egypt", dial_code: "+20", code: "EG" },
//   { name: "Estonia", dial_code: "+372", code: "EE" },
//   { name: "Ethiopia", dial_code: "+251", code: "ET" },
//   { name: "Finland", dial_code: "+358", code: "FI" },
//   { name: "France", dial_code: "+33", code: "FR" },
//   { name: "Germany", dial_code: "+49", code: "DE" },
//   { name: "Ghana", dial_code: "+233", code: "GH" },
//   { name: "Greece", dial_code: "+30", code: "GR" },
//   { name: "Hong Kong", dial_code: "+852", code: "HK" },
//   { name: "Hungary", dial_code: "+36", code: "HU" },
//   { name: "Iceland", dial_code: "+354", code: "IS" },
//   { name: "India", dial_code: "+91", code: "IN" },
//   { name: "Indonesia", dial_code: "+62", code: "ID" },
//   { name: "Iran", dial_code: "+98", code: "IR" },
//   { name: "Iraq", dial_code: "+964", code: "IQ" },
//   { name: "Ireland", dial_code: "+353", code: "IE" },
//   { name: "Israel", dial_code: "+972", code: "IL" },
//   { name: "Italy", dial_code: "+39", code: "IT" },
//   { name: "Japan", dial_code: "+81", code: "JP" },
//   { name: "Kenya", dial_code: "+254", code: "KE" },
//   { name: "Kuwait", dial_code: "+965", code: "KW" },
//   { name: "Malaysia", dial_code: "+60", code: "MY" },
//   { name: "Mexico", dial_code: "+52", code: "MX" },
//   { name: "Nepal", dial_code: "+977", code: "NP" },
//   { name: "Netherlands", dial_code: "+31", code: "NL" },
//   { name: "New Zealand", dial_code: "+64", code: "NZ" },
//   { name: "Nigeria", dial_code: "+234", code: "NG" },
//   { name: "Norway", dial_code: "+47", code: "NO" },
//   { name: "Oman", dial_code: "+968", code: "OM" },
//   { name: "Pakistan", dial_code: "+92", code: "PK" },
//   { name: "Philippines", dial_code: "+63", code: "PH" },
//   { name: "Poland", dial_code: "+48", code: "PL" },
//   { name: "Portugal", dial_code: "+351", code: "PT" },
//   { name: "Qatar", dial_code: "+974", code: "QA" },
//   { name: "Russia", dial_code: "+7", code: "RU" },
//   { name: "Saudi Arabia", dial_code: "+966", code: "SA" },
//   { name: "Singapore", dial_code: "+65", code: "SG" },
//   { name: "South Africa", dial_code: "+27", code: "ZA" },
//   { name: "South Korea", dial_code: "+82", code: "KR" },
//   { name: "Spain", dial_code: "+34", code: "ES" },
//   { name: "Sri Lanka", dial_code: "+94", code: "LK" },
//   { name: "Sweden", dial_code: "+46", code: "SE" },
//   { name: "Switzerland", dial_code: "+41", code: "CH" },
//   { name: "Turkey", dial_code: "+90", code: "TR" },
//   { name: "UAE", dial_code: "+971", code: "AE" },
//   { name: "UK", dial_code: "+44", code: "GB" },
//   { name: "USA", dial_code: "+1", code: "US" },
//   { name: "Vietnam", dial_code: "+84", code: "VN" },
// ];
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
        "https://dev.backend.onrequestlab.com/api/contact/submit/",
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
            <a href="auth/boxed-signup">
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
