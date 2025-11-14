import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Message from "../pages/MessagesList";

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
    setErrors({ ...errors, [e.target.name]: "" }); // clear field error on change
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
        "https://backend.onrequestlab.com/api/v1/users/auth/password/change/",
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

        // Collect field-specific errors
        for (const key in data) {
          if (Array.isArray(data[key])) {
            apiErrors[key] = data[key][0];
          } else if (typeof data[key] === "string") {
            apiErrors[key] = data[key];
          }
        }

        // If non-field error
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
    <div className="p-6 md:p-10 bg-gray-50 min-h-[calc(100vh-80px)]">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="new_password1"
              value={formData.new_password1}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:outline-none ${
                errors.new_password1
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              placeholder="Enter new password"
              required
            />
            {errors.new_password1 && (
              <p className="text-red-500 text-sm mt-1">
                {errors.new_password1}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              name="new_password2"
              value={formData.new_password2}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:outline-none ${
                errors.new_password2
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              placeholder="Re-enter new password"
              required
            />
            {errors.new_password2 && (
              <p className="text-red-500 text-sm mt-1">
                {errors.new_password2}
              </p>
            )}
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white font-medium ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
      <Message />
    </div>
  );
};

export default ChangePassword;
