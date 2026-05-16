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
  const usern = JSON.parse(localStorage.getItem("signupData") || "{}");

    const cookieEmailnew = localStorage.getItem("email");
console.log('cookieEmail1',usern.email);
  useEffect(() => {
    const cookieEmail = cookieEmailnew;//getCookie("email");
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

  if (!usern.email.trim()) {
    toast.error("Email not found");
    return;
  }

  setResending(true);

  try {

    // RESEND OTP API
    const response = await axios.post(
      `${VIT}/api/v1/auth/sendotp`,
      {
        email: usern.email
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("OTP RESPONSE => ", response.data);

    toast.success(
      response.data.message || "OTP Sent Successfully"
    );

    setOtp("");
    setShowOtpInput(true);

  } catch (err: any) {

    console.log("OTP ERROR => ", err);

    toast.error(
      err.response?.data?.message ||
      "Failed to resend OTP"
    );

  } finally {

    setResending(false);

  }
};
      const handleVerifyOTP = async (e: React.FormEvent) => {

  e.preventDefault();

  if (!otp.trim()) {
    toast.error("Please enter OTP");
    return;
  }

  setLoading(true);

  try {

    // GET STORED SIGNUP DATA
    const signupData = JSON.parse(
      localStorage.getItem("signupData") || "{}"
    );

    // FINAL PAYLOAD
    const payload = {
      ...signupData,
      otp: otp
    };

    console.log("SIGNUP PAYLOAD => ", payload);

    // SIGNUP API
    const response = await axios.post(
      `${VIT}/api/v1/auth/signup`,
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("SIGNUP RESPONSE => ", response.data);

    const data = response.data;

    // SUCCESS
    if (data.success) {

      toast.success(
        data.message || "Account Created Successfully"
      );

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // AUTO LOGIN IF TOKEN EXISTS
      if (data.token) {

        localStorage.setItem(
          "token",
          data.token
        );

        toast.success("Login Successful");

        setTimeout(() => {

          navigate("/");

        }, 1000);

      } else {

        // LOGIN PAGE REDIRECT
        setTimeout(() => {

          navigate("/");

        }, 1000);

      }

    }

  } catch (err: any) {

    console.log(err);

    toast.error(
      err.response?.data?.message ||
      "OTP Invalid or Expired"
    );

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
