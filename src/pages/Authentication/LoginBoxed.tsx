import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../store";
import { useEffect, useState } from "react";
import axios from "axios";
import { setPageTitle } from "../../store/themeConfigSlice";
import i18next from "i18next";
import { toast, ToastContainer } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

import "react-toastify/dist/ReactToastify.css";
import IconMail from "../../components/Icon/IconMail";
import IconLockDots from "../../components/Icon/IconLockDots";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";
// import { SingupMetaTags } from "../Pages/SingupMetaTags";


console.log(import.meta.env.VITE_API_URL);
const VIT=import.meta.env.VITE_API_URL;
const SESSION_TIME = 15 * 60;
const SESSION_TIME_MS = 24 * 60 * 60 * 1000;

const LoginBoxed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const themeConfig = useSelector((state: IRootState) => state.themeConfig) || {};

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    dispatch(setPageTitle("Login Boxed"));
  }, [dispatch]);

  
const submitForm = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  setLoading(true);

  try {

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
      {
        email: username,
        password: password,
      },
      {
        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );

    const data = response.data;

    console.log(
      "Login Success:",
      data.user.accountType
    );

    // CLEAR OLD USER DATA
    // localStorage.clear();

    // SAVE TOKEN
    localStorage.setItem(
      "token",
      data.token
    );

    // SAVE USER
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    // SAVE USER ID
    localStorage.setItem(
      "userId",
      data.user._id
    );

    // SAVE SESSION EXPIRY
    const payload = JSON.parse(
      atob(data.token.split(".")[1])
    );

    localStorage.setItem(
      "session_expires_at",
      String(payload.exp * 1000)
    );

    toast.success(
      "Login successful!"
    );

    // REDIRECT
    if(data.user.accountType=="Admin"){
        setTimeout(() => {
            window.location.href =
              "/admin/index";
          }, 1000);
    }else{
          setTimeout(() => {
            window.location.href =
              "/admin/index/overview";
          }, 1000);
    }
    

  } catch (error: any) {

    console.log(
      "Login Error:",
      error
    );

    toast.error(
      error?.response?.data
        ?.message ||
        "Login failed"
    );

  } finally {
    setLoading(false);
  }
};

  // ✅ FORGOT PASSWORD HANDLER
  const handleForgotSubmit = async () => {
    if (!resetEmail.trim()) {
      toast.error("Please enter your email address.", { position: "top-center" });
      return;
    }

    setResetLoading(true);
    try {
      const response = await axios.post( 
        `${VIT}/api/v1/users/password/reset/`,
        { email: resetEmail },
        { headers: { "Content-Type": "application/json" } }
      );

      const message = response.data.detail || "Reset link sent successfully!";
      toast.success(message, { position: "top-center" });
      setResetEmail("");
      setShowForgotModal(false);
    } catch (err: any) {
      let msg = "Something went wrong!";
      if (err.response?.data) {
        const data = err.response.data;
        if (data.email) msg = data.email[0];
        else if (data.detail) msg = data.detail;
      }
      toast.error(msg, { position: "top-center" });
    } finally {
      setResetLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse?.credential;
    
    if (!idToken) {
      toast.error("Google login failed. Please try again.");
      return;
    }

    try {
      
      const response = await axios.post(
        `${VIT}/api/v1/users/auth/google/`,
        { id_token: idToken },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;
      
      if (data.user && data.access) {
        // Store tokens (matching existing login flow)
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("userId", String(data.user.id));
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("is_superuser", String(data.user.is_superuser));
        
        // Store additional user data if needed
        if (data.user.first_name) localStorage.setItem("first_name", data.user.first_name);
        if (data.user.profile_image) localStorage.setItem("profile_image", data.user.profile_image);

        toast.success("Google login successful!");

        // Redirect (same as existing login)
        setTimeout(() => {
          window.location.href = data.user.is_superuser ? "/index" : "/";
        }, 800);
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.response?.data?.error || "Google login failed. Please try again.";
      toast.error(errorMsg);
      console.error("Google login error:", err);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  return (
    <>
    <Navbar />
      <div>
      <div className="absolute inset-0">
        <img
          src="/assets/images/auth/bg-gradient.png"
          alt="background"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center px-6 py-10 dark:bg-[#060818] sm:px-16">
        <div className="relative w-full max-w-[870px] rounded-md bg-white/60 dark:bg-black/50 p-2 backdrop-blur-lg shadow-lg">
          <div className="relative flex flex-col justify-center rounded-md bg-white/80 px-6 py-20 dark:bg-black/60">
            <div className="mx-auto w-full max-w-[440px]">
              <div className="mb-10 text-center">
                <h1 className="text-3xl font-extrabold uppercase text-primary md:text-4xl">
                  {i18next.t("Sign in")} 
                </h1>
                <p className="text-base font-bold text-white-dark">
                  {i18next.t("Enter your credentials to log in")}
                </p>
              </div>
             
              {/* LOGIN FORM */}
              {!showForgotModal && (
                <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                  <div>
                    <label>{i18next.t("Username")}</label>
                    <div className="relative text-white-dark">
                      <input
                        type="text"
                        placeholder={i18next.t("Enter username")}
                        className={`form-input ps-10 placeholder:text-white-dark`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconMail fill={true} />
                      </span>
                    </div>
                  </div>

                  <div>
                    <label>{i18next.t("Password")}</label>
                    <div className="relative text-white-dark">
                      <input
                        type="password"
                        placeholder={i18next.t("Enter password")}
                        className={`form-input ps-10 placeholder:text-white-dark`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconLockDots fill={true} />
                      </span>
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-gradient !mt-6 w-full uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>

                  {/* Google Button */}
                <div className="mt-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap={false}
                      theme="outline"
                      size="large"
                      text="signin_with"
                      shape="rectangular"
                    />
                  </div>
                </div>

                  <p
                    className="text-primary text-center mt-3 cursor-pointer hover:underline"
                    onClick={() => setShowForgotModal(true)}
                  >
                    Forgot Password?
                  </p>
                </form>
              )}

              {/* FORGOT PASSWORD FORM */}
              {showForgotModal && (
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="form-input w-full"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleForgotSubmit}
                    disabled={resetLoading}
                    className={`btn btn-gradient w-full ${
                      resetLoading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {resetLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                  <p
                    className="text-center text-primary cursor-pointer mt-2 hover:underline"
                    onClick={() => setShowForgotModal(false)}
                  >
                    Back to Login
                  </p>
                </div>
              )}

            </div>

            <div className="text-center mt-6 dark:text-white">
              {i18next.t("Don't have an account?")}{" "}
              <Link
                to="/register"
                className="uppercase text-primary underline transition hover:text-black dark:hover:text-white"
              >
                {i18next.t("Register here")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer autoClose={2000} theme="colored" />
    </div>
     <Footer />
    </>
    
  );
};

export default LoginBoxed;