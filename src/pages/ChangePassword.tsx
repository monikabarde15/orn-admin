import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../pages/Components/Navbar";
import Footer from "../pages/Components/Footer";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    new_password1: "",
    new_password2: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const accessToken = getCookie("access");

    if (!accessToken) {
      toast.error("No access token found. Please log in again.");
      return;
    }

    if (formData.new_password1 !== formData.new_password2) {
      setErrors({
        new_password2: "Passwords do not match.",
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "https://dev.backend.onrequestlab.com/api/v1/users/auth/password/change/",
        {
          new_password1: formData.new_password1,
          new_password2: formData.new_password2,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Password changed successfully!");
      setFormData({ new_password1: "", new_password2: "" });
    } catch (error) {
      if (error.response?.data) {
        const apiErrors = {};
        const data = error.response.data;
        for (const key in data) {
          if (Array.isArray(data[key])) {
            apiErrors[key] = data[key][0];
          } else if (typeof data[key] === "string") {
            apiErrors[key] = data[key];
          }
        }
        if (Object.keys(apiErrors).length === 0 && data.detail) {
          toast.error(data.detail);
        } else {
          setErrors(apiErrors);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 px-4">
        <div className="max-w-md mx-auto bg-gray-900/70 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-700">
          <h2 className="text-3xl font-bold text-white text-center mb-8 border-b border-gray-700 pb-4">
            Change Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="new_password1"
                value={formData.new_password1}
                onChange={handleChange}
                placeholder="Enter new password"
                className={`w-full p-3 rounded-lg bg-gray-800 border focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 ${
                  errors.new_password1
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-600"
                }`}
                required
              />
              {errors.new_password1 && (
                <p className="text-red-500 text-sm mt-1">{errors.new_password1}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="new_password2"
                value={formData.new_password2}
                onChange={handleChange}
                placeholder="Re-enter new password"
                className={`w-full p-3 rounded-lg bg-gray-800 border focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 ${
                  errors.new_password2
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-600"
                }`}
                required
              />
              {errors.new_password2 && (
                <p className="text-red-500 text-sm mt-1">{errors.new_password2}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition-colors duration-200 ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                }`}
              >
                {loading ? "Updating..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChangePassword;
