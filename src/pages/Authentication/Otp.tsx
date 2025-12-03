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

  // Get cookie email
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };
    const cookieEmailnew = localStorage.getItem("email");
console.log('cookieEmail1',cookieEmailnew);
  useEffect(() => {
    const cookieEmail = cookieEmailnew;//getCookie("email");
    console.log('cookieEmail',cookieEmail);
    if (cookieEmail) setEmail(decodeURIComponent(cookieEmail));
  }, []);

  // SEND / RESEND OTP
  const handleSendOTP = async () => {
    if (!email.trim()) {
      toast.error("Email not found. Please login again.", {
        position: "top-center",
      });
      return;
    }

    setResending(true);
    try {
      const response = await axios.post(
        "https://backend.onrequestlab.com/api/v1/users/auth/resend-otp/",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success(response.data?.message || "OTP Sent Successfully!", {
        position: "top-center",
      });

      setShowOtpInput(true);
      setOtpExpired(false);
      setOtp("");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to resend OTP.";
      toast.error(msg, { position: "top-center" });
    } finally {
      setResending(false);
    }
  };

  // VERIFY OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter OTP.", { position: "top-center" });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://backend.onrequestlab.com/api/v1/users/auth/verify-otp/",
        { email, otp },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log('response=',response);
      toast.success("OTP Verified Successfully!", { position: "top-center" });

     setTimeout(() => navigate("/login"), 1200);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "OTP Invalid or Expired.";
      toast.error(msg, { position: "top-center" });

      // Show resend section
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

        {showOtpInput ? (
          // OTP INPUT Screen
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

            {/* Default Resend OTP Button */}
            <button
              type="button"
              onClick={handleSendOTP}
              disabled={resending}
              className={`btn btn-outline-primary w-full mt-2 ${
                resending ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          </form>
        ) : (
          // RESEND OTP SCREEN
          <div className="space-y-4">
            {otpExpired && (
              <p className="text-red-500 text-center">
                OTP invalid or expired. Please resend OTP.
              </p>
            )}

            {/* EMAIL FROM COOKIE (not editable) */}
            <input
              type="email"
              className="form-input w-full bg-gray-200 cursor-not-allowed"
              value={email}
              disabled
            />

            {/* Resend Button */}
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
