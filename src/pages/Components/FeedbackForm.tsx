import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Send, Star, User, Mail, MessageSquare } from 'lucide-react';
import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    category: '',
    message: ''
  });

  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Red Hat Cluster Lab',
    'Linux Lab',
    'Docker Lab',
    'Kubernetes Lab',
    'Terraform Lab',
    'General Feedback'
  ];

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.rating === 0) {
    alert("Please select a rating.");
    return;
  }

  setLoading(true);

  try {
const getCookie = (name) => {
if (typeof document === "undefined") return "";
const v = `; ${document.cookie}`;
const parts = v.split(`; ${name}=`);
if (parts.length === 2) return parts.pop().split(";").shift();
return "";
};

const token =
(getCookie("access") ||
localStorage.getItem("access") ||
localStorage.getItem("jwt-auth"))?.trim();
const userId = getCookie("user_id");
const payload = {
  user: formData.name,               // or userId if backend needs ID
  subject: formData.category,        // or formData.email if category not required
  description: formData.message
};

    const response = await axios.post(
      "https://dev.backend.onrequestlab.com/api/feedback/feedback_vc/",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    alert("Thank you! Your feedback has been submitted.");

    setFormData({
      name: '',
      email: '',
      rating: 0,
      category: '',
      message: ''
    });

  } catch (error) {
    console.error(error);
    alert("Error submitting feedback. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              We Value Your Feedback
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Help us improve our labs and services. Your feedback matters to us.
          </p>
        </motion.div>

        {/* Feedback Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl blur-xl"></div>

          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-3">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-3">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-3">
                  Rate Your Experience *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 transition-colors ${
                          star <= (hoveredStar || formData.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-3">
                  Feedback Category *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white cursor-pointer"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat} className="bg-slate-900">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-3">
                  Your Feedback *
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 text-gray-500 w-5 h-5" />
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Tell us about your experience..."
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Submitting..." : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Feedback
                  </>
                )}
              </motion.button>

            </form>

            <p className="text-center text-gray-400 text-sm mt-6">
              Your feedback helps us create better learning experiences for everyone.
            </p>

          </div>
        </motion.div>

      </div>
    </div>
    <Footer />
    </>
    
  );
};

export default FeedbackForm;
