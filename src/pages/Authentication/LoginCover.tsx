import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../store";
import { useEffect, useState } from "react";
import axios from "axios";
import { setPageTitle, toggleRTL } from "../../store/themeConfigSlice";
import Dropdown from "../../components/Dropdown";
import i18next from "i18next";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import IconCaretDown from "../../components/Icon/IconCaretDown";
import IconMail from "../../components/Icon/IconMail";
import IconLockDots from "../../components/Icon/IconLockDots";
import IconInstagram from "../../components/Icon/IconInstagram";
import IconFacebookCircle from "../../components/Icon/IconFacebookCircle";
import IconTwitter from "../../components/Icon/IconTwitter";
import IconGoogle from "../../components/Icon/IconGoogle";

const LoginBoxed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const themeConfig =
    useSelector((state: IRootState) => state.themeConfig) || {};
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === "rtl";

  const [flag, setFlag] = useState(themeConfig.locale || "en");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🟩 Default languages if not defined in themeConfig
  const languageList =
    themeConfig.languageList ||
    [
      { code: "en", name: "English" },
      { code: "ae", name: "Arabic" },
    ];

  useEffect(() => {
    dispatch(setPageTitle("Login Boxed"));
  }, [dispatch]);

  // 🌍 Change Language
  const setLocale = (flag: string) => {
    setFlag(flag);
    dispatch(toggleRTL(flag.toLowerCase() === "ae" ? "rtl" : "ltr"));
    i18next.changeLanguage(flag);
    toast.info(`Language changed to ${flag.toUpperCase()}`, {
      position: "top-center",
    });
  };

  // 🔐 Submit Login
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://backend.onrequestlab.com/api/v1/users/auth/login",
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const data = response.data;

      // ✅ Successful login
      if (data.user) {
        document.cookie = `username=${encodeURIComponent(
          data.user.username
        )}; path=/; max-age=86400`;
        document.cookie = `user_id=${encodeURIComponent(
          data.user.id
        )}; path=/; max-age=86400`;
        document.cookie = `email=${encodeURIComponent(
          data.user.email
        )}; path=/; max-age=86400`;
        document.cookie = `is_staff=${data.user.is_staff}; path=/; max-age=86400`;
        document.cookie = `access=${data.access}; path=/; max-age=86400`;
        localStorage.setItem("jwt-auth", data.access);
 localStorage.setItem("email", data.user.email);
        toast.success("Login successful!", { position: "top-center" });

        setTimeout(() => {
          if (data.user.id === 7) {
            window.location.href = "/";
          } else {
            window.location.href = "/index";
          }
        }, 1200);
      } else {
        toast.error(data.message || "Login failed", { position: "top-center" });
      }
    } catch (err: any) {
      console.error(err);

      // 🟥 Handle server error messages
      let msg = "Invalid username or password.";

      if (err.response?.data) {
        const data = err.response.data;

        // Handle structured validation error
        if (typeof data === "object" && !Array.isArray(data)) {
          const firstKey = Object.keys(data)[0];
          if (firstKey && Array.isArray(data[firstKey])) {
            msg = data[firstKey][0];
          } else if (data.error) {
            msg = data.error;
          } else if (data.message) {
            msg = data.message;
          } else if (data.detail) {
            msg = data.detail;
          }
        } else if (typeof data === "string") {
          msg = data;
        }
      }

      setError(msg);
      toast.error(msg, { position: "top-center" });
    } finally {
      setLoading(false);
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
        <img
          src="/assets/images/auth/coming-soon-object1.png"
          alt=""
          className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2"
        />
        <img
          src="/assets/images/auth/coming-soon-object2.png"
          alt=""
          className="absolute left-24 top-0 h-40 md:left-[30%]"
        />
        <img
          src="/assets/images/auth/coming-soon-object3.png"
          alt=""
          className="absolute right-0 top-0 h-[300px]"
        />
        <img
          src="/assets/images/auth/polygon-object.svg"
          alt=""
          className="absolute bottom-0 end-[28%]"
        />

        <div className="relative w-full max-w-[870px] rounded-md bg-white/60 dark:bg-black/50 p-2 backdrop-blur-lg shadow-lg">
          <div className="relative flex flex-col justify-center rounded-md bg-white/80 px-6 lg:min-h-[758px] py-20 dark:bg-black/60">
            {/* 🌍 Language Selector */}
            <div className="absolute top-6 end-6">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? "bottom-start" : "bottom-end"}`}
                btnClassName="flex items-center gap-2.5 rounded-lg border border-white-dark/30 bg-white px-2 py-1.5 text-white-dark hover:border-primary hover:text-primary dark:bg-black"
                button={
                  <>
                    <img
                      src={`/assets/images/flags/${flag.toUpperCase()}.svg`}
                      alt="flag"
                      className="h-5 w-5 rounded-full object-cover"
                    />
                    <div className="text-base font-bold uppercase">{flag}</div>
                    <IconCaretDown />
                  </>
                }
              >
                <ul className="!px-2 grid grid-cols-2 gap-2 font-semibold w-[280px] text-dark dark:text-white">
                  {languageList.map((item) => (
                    <li key={item.code}>
                      <button
                        type="button"
                        className={`flex w-full hover:text-primary rounded-lg ${
                          flag === item.code ? "bg-primary/10 text-primary" : ""
                        }`}
                        onClick={() => setLocale(item.code)}
                      >
                        <img
                          src={`/assets/images/flags/${item.code.toUpperCase()}.svg`}
                          alt="flag"
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="ltr:ml-3 rtl:mr-3">{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </Dropdown>
            </div>

            {/* 🧾 Login Form */}
            <div className="mx-auto w-full max-w-[440px]">
              <div className="mb-10">
                <h1 className="text-3xl font-extrabold uppercase text-primary md:text-4xl">
                  {i18next.t("Sign in")} 1
                </h1>
                <p className="text-base font-bold text-white-dark">
                  {i18next.t("Enter your credentials to log in")}
                </p>
              </div>

              <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                <div>
                  <label htmlFor="Username">{i18next.t("Username")}</label>
                  <div className="relative text-white-dark">
                    <input
                      id="Username"
                      type="text"
                      placeholder={i18next.t("Enter Username")}
                      className={`form-input ps-10 placeholder:text-white-dark ${
                        error.toLowerCase().includes("username")
                          ? "border-red-500"
                          : ""
                      }`}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                      <IconMail fill={true} />
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="Password">{i18next.t("Password")}</label>
                  <div className="relative text-white-dark">
                    <input
                      id="Password"
                      type="password"
                      placeholder={i18next.t("Enter Password")}
                      className={`form-input ps-10 placeholder:text-white-dark ${
                        error.toLowerCase().includes("password")
                          ? "border-red-500"
                          : ""
                      }`}
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
              </form>

              {/* Social buttons */}
              

              <ul className="flex justify-center gap-3 text-white">
                {[IconInstagram, IconFacebookCircle, IconTwitter, IconGoogle].map(
                  (Icon, idx) => (
                    <li key={idx}>
                      <Link
                        to="#"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:scale-110"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(239,18,98,1) 0%, rgba(67,97,238,1) 100%)",
                        }}
                      >
                        <Icon />
                      </Link>
                    </li>
                  )
                )}
              </ul>

              <div className="text-center mt-6 dark:text-white">
                {i18next.t("Employee account?")}{" "}
                <Link
                  to="/auth/cover-login"
                  className="uppercase text-primary underline transition hover:text-black dark:hover:text-white"
                >
                  {i18next.t("Employee Sign In")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer autoClose={2000} theme="colored" />
    </div>
  );
};

export default LoginBoxed;
