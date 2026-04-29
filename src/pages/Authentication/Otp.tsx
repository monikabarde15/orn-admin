import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import i18next from "i18next";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
console.log(import.meta.env.VITE_API_URL);
const VIT=import.meta.env.VITE_API_URL;
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

  // Auth guard – redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

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
        `${VIT}/api/v1/users/auth/resend-otp/`,
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
  // const handleVerifyOTP = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!otp.trim()) {
  //     toast.error("Please enter OTP.", { position: "top-center" });
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const response = await axios.post(
  //       "https://dev.backend.onrequestlab.com/api/v1/users/auth/verify-otp/",
  //       { email, otp },
  //       { headers: { "Content-Type": "application/json" } }
  //     );
  //     console.log('response=',response);
  //     // toast.success("OTP Verified Successfully!", { position: "top-center" });
  //           const data = response.data;
  //           if (data.user) {
  //             // Save cookies
  //             document.cookie = `username=${encodeURIComponent(data.user.username)}; path=/; max-age=86400`;
  //             document.cookie = `user_id=${encodeURIComponent(data.user.id)}; path=/; max-age=86400`;
  //             document.cookie = `email=${encodeURIComponent(data.user.email)}; path=/; max-age=86400`;
  //             document.cookie = `is_staff=${data.user.is_staff}; path=/; max-age=86400`;
  //             document.cookie = `access=${data.access}; path=/; max-age=86400`;
      
  //             // Save localStorage
  //             localStorage.setItem("jwt-auth", data.access);
  //             localStorage.setItem("userId", data.user.id);
  //             localStorage.setItem("email", data.user.email);
  //             localStorage.setItem("username", data.user.username);
      
  //             toast.success("OTP Verified Successfully!", { position: "top-center" });
      
  //             setTimeout(() => {
  //               if (data.user.id < 2) {
  //                 window.location.href = "/index";
  //               } else {
  //                 window.location.href = "/";
  //               }
  //             }, 1200);
  //           }

  //  //  setTimeout(() => navigate("/login"), 1200);
  //   } catch (err: any) {
  //     const msg =
  //       err.response?.data?.message ||
  //       err.response?.data?.error ||
  //       "OTP Invalid or Expired.";
  //     toast.error(msg, { position: "top-center" });

  //     // Show resend section
  //     setOtpExpired(true);
  //     setShowOtpInput(false);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleVerifyOTP = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!otp.trim()) {
    toast.error("Please enter OTP.", { position: "top-center" });
    return;
  }

  setLoading(true);
  try {
    const response = await axios.post(
      `${VIT}/api/v1/users/auth/verify-otp/`,
      { email, otp },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    const data = response.data;
    console.log('data=',data);
    if (data.user) {

      // Set cookies (working)
      document.cookie = `access=${encodeURIComponent(data.access)}; path=/; max-age=86400; SameSite=Lax; Secure`;
      document.cookie = `username=${encodeURIComponent(data.user.username)}; path=/; max-age=86400; SameSite=Lax; Secure`;
      document.cookie = `user_id=${encodeURIComponent(data.user.id)}; path=/; max-age=86400; SameSite=Lax; Secure`;
      document.cookie = `email=${encodeURIComponent(data.user.email)}; path=/; max-age=86400; SameSite=Lax; Secure`;
      document.cookie = `is_staff=${data.user.is_staff}; path=/; max-age=86400; SameSite=Lax; Secure`;
      

      // LocalStorage
      localStorage.setItem("jwt-auth", data.access);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("username", data.user.username);

      toast.success("OTP Verified Successfully!", { position: "top-center" });

      setTimeout(() => {
        // window.location.href = data.user.id < 2 ? "/index" : "/login";
        navigate(data.user.id < 2 ? "/index" : "/login", { replace: true });
      }, 1200);
    }

  } catch (err: any) {
    const msg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "OTP Invalid or Expired.";

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
