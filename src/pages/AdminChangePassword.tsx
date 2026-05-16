import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../services/api";

const AdminChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    // validation
    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toast.error("All fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({
        confirmPassword: "Passwords do not match",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/api/v1/auth/changePassword",
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }
      );

      toast.success(
        response.data.message || "Password changed successfully 🎉"
      );

      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Password update failed"
      );
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

          {/* OLD PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Old Password
            </label>

            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Enter old password"
              className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:outline-none ${
                errors.oldPassword
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
            />

            {errors.oldPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.oldPassword}
              </p>
            )}
          </div>

          {/* NEW PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              New Password
            </label>

            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:outline-none ${
                errors.newPassword
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
            />

            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:outline-none ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
            />

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* BUTTON */}
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
    </div>
  );
};

export default AdminChangePassword;