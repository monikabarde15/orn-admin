import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../store";
import { useEffect, useState } from "react";
import axios from "axios";
import { setPageTitle } from "../../store/themeConfigSlice";
import i18next from "i18next";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IconMail from "../../components/Icon/IconMail";
import IconLockDots from "../../components/Icon/IconLockDots";

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

  // ✅ LOGIN HANDLER
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      toast.error("Please fill in all fields.", { position: "top-center" });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://backend.onrequestlab.com/api/v1/users/auth/login",
        { username, password },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      const data = response.data;
      if (data.user) {
        // Save cookies
        document.cookie = `username=${encodeURIComponent(data.user.username)}; path=/; max-age=86400`;
        document.cookie = `user_id=${encodeURIComponent(data.user.id)}; path=/; max-age=86400`;
        document.cookie = `email=${encodeURIComponent(data.user.email)}; path=/; max-age=86400`;
        document.cookie = `is_staff=${data.user.is_staff}; path=/; max-age=86400`;
        document.cookie = `access=${data.access}; path=/; max-age=86400`;

        // Save localStorage
        localStorage.setItem("jwt-auth", data.access);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("username", data.user.username);

        toast.success("Login successful!", { position: "top-center" });

        setTimeout(() => {
          if (data.user.id < 2) {
            window.location.href = "/index";
          } else {
            window.location.href = "/index/overview";
          }
        }, 1200);
      }
    } catch (err: any) {
      let msg = "Invalid username or password.";

      if (err.response?.data) {
        const data = err.response.data;

        // ✅ Handle email verification error
        if (data.non_field_errors && data.non_field_errors[0]?.includes("verify your email")) {
          msg = (
            <span>
              {data.non_field_errors[0]}{" "}
              <Link to="/otp" className="text-blue-500 underline">
                Verify OTP
              </Link>
            </span>
          );
        } else if (data.detail) msg = data.detail;
        else if (data.error) msg = data.error;
        else if (typeof data === "object") {
          const firstKey = Object.keys(data)[0];
          if (Array.isArray(data[firstKey])) msg = data[firstKey][0];
        }
      }

      setError(msg as string);
      toast.error(msg, { position: "top-center", autoClose: 4000 });
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
        "https://backend.onrequestlab.com/api/v1/users/auth/password/reset/",
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

  return (
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
                    <label>{i18next.t("Username or Email")}</label>
                    <div className="relative text-white-dark">
                      <input
                        type="text"
                        placeholder={i18next.t("Enter username or email")}
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
                to="/auth/boxed-signup"
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
  );
};

export default LoginBoxed;
