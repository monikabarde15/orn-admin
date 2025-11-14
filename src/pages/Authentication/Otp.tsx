import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import i18next from "i18next";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OtpVerification = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(true);
  const [otpExpired, setOtpExpired] = useState(false);

  // ✅ Get email from cookie
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  // ✅ Load email from cookie on mount
  useEffect(() => {
    const cookieEmail = getCookie("email");
    if (cookieEmail) setEmail(decodeURIComponent(cookieEmail));
  }, []);

  // ✅ Handle sending/resending OTP
  const handleSendOTP = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email.", { position: "top-center" });
      return;
    }

    setResending(true);
    try {
      const response = await axios.post(
        "https://backend.onrequestlab.com/api/v1/users/auth/resend-otp/",
        { email }, // ✅ Correct key
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success(response.data?.message || "OTP has been sent!", {
        position: "top-center",
      });
      setShowOtpInput(true);
      setOtpExpired(false);
      setOtp("");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to send OTP.";
      toast.error(msg, { position: "top-center" });
    } finally {
      setResending(false);
    }
  };

  // ✅ Handle OTP verification
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter OTP.", { position: "top-center" });
      return;
    }

    if (!email.trim()) {
      toast.error("Email is missing.", { position: "top-center" });
      setShowOtpInput(false);
      setOtpExpired(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://backend.onrequestlab.com/api/v1/users/auth/verify-otp/",
        { email, otp }, // ✅ Correct key
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("OTP verified successfully!", { position: "top-center" });
      setOtpExpired(false);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "OTP verification failed.";
      toast.error(msg, { position: "top-center" });

      setOtpExpired(true);
      setShowOtpInput(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center px-6 py-10 dark:bg-[#060818] sm:px-16">
      <div className="relative w-full max-w-[420px] rounded-lg bg-white/80 p-8 dark:bg-black/60 backdrop-blur-md shadow-lg">
        <h1 className="text-3xl font-extrabold text-primary mb-6 uppercase text-center">
          {i18next.t("Verify OTP")}
        </h1>

        {/* Show OTP input if allowed */}
        {showOtpInput ? (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              OTP sent to <b>{email}</b>
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              className="form-input w-full"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn btn-gradient w-full"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        ) : (
          // Resend OTP section
          <div className="space-y-4">
            {otpExpired && (
              <p className="text-red-500 text-center">
                OTP expired or invalid. Please resend OTP.
              </p>
            )}
            <input
              type="email"
              placeholder="Enter your email"
              className="form-input w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="button"
              onClick={handleSendOTP}
              disabled={resending}
              className={`btn btn-gradient w-full ${
                resending ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          </div>
        )}
      </div>

      <ToastContainer autoClose={2000} theme="colored" />
    </div>
  );
};

export default OtpVerification;
