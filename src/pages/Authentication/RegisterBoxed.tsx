import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../store";
import { setPageTitle, toggleRTL } from "../../store/themeConfigSlice";
import { useEffect, useState } from "react";
import Dropdown from "../../components/Dropdown";
import i18next from "i18next";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import IconCaretDown from "../../components/Icon/IconCaretDown";
import IconUser from "../../components/Icon/IconUser";
import IconMail from "../../components/Icon/IconMail";
import IconLockDots from "../../components/Icon/IconLockDots";

const RegisterBoxed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === "rtl";
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const [flag, setFlag] = useState(themeConfig.locale);

  useEffect(() => {
    dispatch(setPageTitle("Register Boxed"));
  }, [dispatch]);

  // 🌐 Language + RTL toggle
  const setLocale = (langCode: string) => {
    setFlag(langCode);
    i18next.changeLanguage(langCode);
    if (langCode.toLowerCase() === "ae") {
      dispatch(toggleRTL("rtl"));
    } else {
      dispatch(toggleRTL("ltr"));
    }
    toast.success(i18next.t("Language changed to") + " " + langCode.toUpperCase(), {
      position: "top-center",
    });
  };

  // -------------------------------
  // Form State
  // -------------------------------
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    phone: "",
    password1: "",
    password2: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // -------------------------------
  // Validation Function
  // -------------------------------
  const validate = () => {
    let temp: any = {};
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (!formData.first_name || !nameRegex.test(formData.first_name))
      temp.first_name = i18next.t("First name must be at least 2 letters.");
    if (!formData.last_name || !nameRegex.test(formData.last_name))
      temp.last_name = i18next.t("Last name must be at least 2 letters.");
    if (!formData.email || !emailRegex.test(formData.email))
      temp.email = i18next.t("Enter a valid email.");
    if (!formData.username || formData.username.length < 4)
      temp.username = i18next.t("Username must be at least 4 characters.");
    if (!formData.phone || !phoneRegex.test(formData.phone))
      temp.phone = i18next.t("Phone number must be 10 digits.");
    if (!formData.password1 || formData.password1.length < 6)
      temp.password1 = i18next.t("Password must be at least 6 characters.");
    if (formData.password1 !== formData.password2)
      temp.password2 = i18next.t("Passwords do not match.");

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // -------------------------------
  // Handle Change
  // -------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev: any) => ({ ...prev, [e.target.name]: "" })); // clear error while typing
  };

  // -------------------------------
  // Handle Submit
  // -------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "https://backend.onrequestlab.com/api/v1/users/auth/registration/",
        {
          ...formData,
          is_superuser: false,
          is_staff: false,
          is_active: true,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.detail) {
        sessionStorage.setItem("formData", JSON.stringify(formData));

        document.cookie = `username=${encodeURIComponent(
          formData.username
        )}; path=/; max-age=86400`;
       
        document.cookie = `email=${encodeURIComponent(
         formData.email
        )}; path=/; max-age=86400`;
         localStorage.setItem("email", formData.email);

        toast.success(i18next.t("OTP sent successfully!"), {
          position: "top-center",
        });
        navigate("/otp");
      } else {
        toast.success(i18next.t("Registration successful!"), {
          position: "top-center",
        });
        navigate("/");
      }
    } catch (error: any) {
      console.error(error);

      // Handle field-specific API validation errors
      if (error.response?.data) {
        const serverErrors = error.response.data;

        // If it’s a field-level error object like { "password1": ["error msg"] }
        if (typeof serverErrors === "object" && !serverErrors.detail) {
          const formattedErrors: any = {};
          Object.keys(serverErrors).forEach((key) => {
            formattedErrors[key] = serverErrors[key][0];
          });
          setErrors((prev: any) => ({ ...prev, ...formattedErrors }));
          toast.error(i18next.t("Please correct highlighted fields."), {
            position: "top-center",
          });
        } else {
          toast.error(serverErrors.detail || i18next.t("Something went wrong."), {
            position: "top-center",
          });
        }
      } else {
        toast.error(i18next.t("An error occurred. Please try again."), {
          position: "top-center",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center px-6 py-10 dark:bg-[#060818] sm:px-16">
      {/* 🌍 Language Dropdown */}
      {/*<div className="absolute top-6 right-6">
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
              <span className="shrink-0">
                <IconCaretDown />
              </span>
            </>
          }
        >
          <ul className="!px-2 text-dark dark:text-white-dark grid grid-cols-2 gap-2 font-semibold w-[280px]">
            {themeConfig.languageList.map((item: any) => (
              <li key={item.code}>
                <button
                  type="button"
                  className={`flex w-full items-center gap-2 rounded-lg p-1 hover:text-primary ${
                    flag === item.code ? "bg-primary/10 text-primary" : ""
                  }`}
                  onClick={() => setLocale(item.code)}
                >
                  <img
                    src={`/assets/images/flags/${item.code.toUpperCase()}.svg`}
                    alt="flag"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </Dropdown>
      </div>*/}

      {/* 🧾 Registration Form */}
      <div className="relative w-full max-w-[480px] rounded-lg bg-white/80 p-8 dark:bg-black/60 backdrop-blur-md shadow-lg">
        <h1 className="text-3xl font-extrabold text-primary mb-6 uppercase text-center">
          {i18next.t("Sign Up")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "first_name", label: "First Name", icon: <IconUser /> },
            { name: "last_name", label: "Last Name", icon: <IconUser /> },
            { name: "email", label: "Email", icon: <IconMail />, type: "email" },
            { name: "username", label: "Username", icon: <IconUser /> },
            { name: "phone", label: "Phone Number", icon: <IconUser />, type: "number" },
            { name: "password1", label: "Password", icon: <IconLockDots />, type: "password" },
            { name: "password2", label: "Confirm Password", icon: <IconLockDots />, type: "password" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold">
                {i18next.t(field.label)}
              </label>
              <div className="relative">
                <input
                  name={field.name}
                  type={field.type || "text"}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  placeholder={`${i18next.t("Enter")} ${i18next.t(field.label)}`}
                  className={`form-input ps-10 w-full placeholder:text-white-dark ${
                    errors[field.name] ? "border-red-500" : ""
                  }`}
                />
                <span className="absolute start-4 top-1/2 -translate-y-1/2 text-white-dark">
                  {field.icon}
                </span>
              </div>
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-gradient mt-6 w-full uppercase border-0 shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
          >
            {loading ? i18next.t("Registering...") : i18next.t("Sign Up")}
          </button>
        </form>

        <div className="text-center mt-6 text-sm dark:text-white">
          {i18next.t("Already have an account?")}{" "}
          <Link
            to="/login"
            className="text-primary font-semibold underline"
          >
            {i18next.t("Sign In")}
          </Link>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer autoClose={2000} theme="colored" />
    </div>
  );
};

export default RegisterBoxed;
