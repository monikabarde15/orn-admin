import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // react-router-dom for redirect

// Axios default configuration
axios.defaults.baseURL = "https://backend.onrequestlab.com/api/v1/users";
axios.defaults.headers.common["accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["X-CSRFTOKEN"] = "2sffuGqjATmmKMpila2h0gg5sxHU2cBNpDtt6FsHiB627oLHumG1dST5zzDqqGT5";

export default function GoogleSocialLogin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // for redirect

   const handleGoogleSuccess = async (response) => {
    setLoading(true);

    try {
      // Decode Google JWT to get user info
      const decoded = jwt_decode(response.credential);
      localStorage.setItem("email", decoded.email);

      // Prepare payload for /auth/social/ API
      const data = {
        username: decoded.name.replace(/\s+/g, "").toLowerCase(),
        email: decoded.email,
        first_name: decoded.given_name,
        last_name: decoded.family_name,
        password1: "RandomPass123!",
        password2: "RandomPass123!",
        phone: "0000000000",
      };

      // Call social register API
      const res = await axios.post("/auth/social/", data);

      const { access, refresh, user, email_verified, verify_key } = res.data;

      // Save tokens
      localStorage.setItem("orl_access", access);
      localStorage.setItem("orl_refresh", refresh);
      localStorage.setItem("email", decoded.email);

      toast.success("Google registration successful!");
         navigate("/otp", { state: { email: decoded.email } });
      // Agar email verify karna ho (OTP/verify_key)
      if (!email_verified && verify_key) {
        // OTP send/verify API call
        await axios.post("/auth/social/verify-email/", { key: verify_key });
        toast.success("Email verification sent! Redirecting...");
        
        // Redirect user to OTP/verification page
        navigate("/verify-otp", { state: { email: decoded.email } });
      } else {
        // Agar email already verified ho, redirect dashboard ya home
        navigate("/otp");
      }

      setLoading(false);
    } catch (err) {
      if (err.response && err.response.data) {
        const errors = err.response.data;
        for (let key in errors) {
          if (errors[key] && errors[key].length > 0) {
            toast.error(errors[key][0]);
            break;
          }
        }
      } else {
        toast.error("Something went wrong!");
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => toast.error("Google login failed")}
      />
      {loading && <p className="text-blue-600">Processing...</p>}
    </div>
  );
}
