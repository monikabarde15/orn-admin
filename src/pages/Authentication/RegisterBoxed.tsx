import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/themeConfigSlice";
import { useEffect, useState } from "react";
import i18next from "i18next";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import IconUser from "../../components/Icon/IconUser";
import IconMail from "../../components/Icon/IconMail";
import IconLockDots from "../../components/Icon/IconLockDots";
import CountryList from "country-list-with-dial-code-and-flag";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";
import { SingupMetaTags } from "../Pages/SingupMetaTags";

console.log(import.meta.env.VITE_API_URL);
const VIT=import.meta.env.VITE_API_URL;
const RegisterBoxed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("Register Boxed"));
  }, [dispatch]);

  // -------------------------------
  // Country Options
  // -------------------------------
  const countryOptions = CountryList.getAll().map((c) => ({
    dialCode: c.dialCode,
    name: c.name,
    code: c.countryCode,
  }));

  // -------------------------------
  // Form State
  // -------------------------------
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    phone: "",
    country_code: "+91",
    password1: "",
    password2: "",
    accountType: "Student",
  });

  const [errors, setErrors] = useState<any>({});
  const [apiErrors, setApiErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // -------------------------------
  // Validation
  // -------------------------------
  const validate = () => {
    let temp: any = {};
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex =
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (!formData.first_name || !nameRegex.test(formData.first_name))
      temp.first_name = "First name must be at least 2 letters.";

    if (!formData.last_name || !nameRegex.test(formData.last_name))
      temp.last_name = "Last name must be at least 2 letters.";

    if (!formData.email || !emailRegex.test(formData.email))
      temp.email = "Enter a valid email.";

    if (!formData.username || formData.username.length < 4)
      temp.username = "Username must be at least 4 characters.";

      // if (!formData.phone || !phoneRegex.test(formData.phone))
      //   temp.phone = "Phone number must be 10 digits.";

    if (!formData.password1 || formData.password1.length < 6)
      temp.password1 = "Password must be at least 6 characters.";

    if (formData.password1 !== formData.password2)
      temp.password2 = "Passwords do not match.";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // -------------------------------
  // Handle Change
  // -------------------------------
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    setErrors((prev: any) => ({ ...prev, [e.target.name]: "" }));
    setApiErrors((prev: any) => ({ ...prev, [e.target.name]: "" }));
  };

  // -------------------------------
  // Submit
  // -------------------------------
  const handleSubmit = async (e: any) => {

  e.preventDefault();

  if (!validate()) return;

  setLoading(true);

  try {

    // FULL SIGNUP DATA
    const payload = {
      firstName: formData.first_name,
      lastName: formData.last_name,
      email: formData.email,
      password: formData.password1,
      confirmPassword: formData.password2,
      accountType: formData.accountType,
      contactNumber: formData.phone,
    };

    // SAVE TEMP DATA
    localStorage.setItem(
      "signupData",
      JSON.stringify(payload)
    );

    // SEND OTP API
    const response = await axios.post(
      `${VIT}/api/v1/auth/sendotp`,
      {
        email: formData.email
      }
    );

    console.log(response.data);

    // SUCCESS
    if (response.data.success) {

      toast.success("OTP Sent Successfully");

      // SAVE EMAIL
      localStorage.setItem(
        "otpEmail",
        formData.email
      );

      // REDIRECT OTP PAGE
      setTimeout(() => {
        navigate("/otp");
      }, 1000);

    }

  } catch (error: any) {

    console.log(error);

    toast.error(
      error?.response?.data?.message ||
      "OTP Send Failed"
    );

  } finally {

    setLoading(false);

  }
};

  const fields = [
    { name: "first_name", label: "First Name", icon: <IconUser /> },
    { name: "last_name", label: "Last Name", icon: <IconUser /> },
    { name: "email", label: "Email", icon: <IconMail />, type: "email" },
    { name: "username", label: "Username", icon: <IconUser /> },
    { name: "password1", label: "Password", icon: <IconLockDots />, type: "password" },
    { name: "password2", label: "Confirm Password", icon: <IconLockDots />, type: "password" },
  ];

  return (
    <>
    <SingupMetaTags />
     <Navbar />
      <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center px-6 py-10 dark:bg-[#060818] sm:px-16">

      <div className="w-full max-w-[480px] rounded-lg bg-white/80 dark:bg-black/60 backdrop-blur-md p-8 shadow-lg">
        <h1 className="text-3xl font-extrabold text-primary mb-6 uppercase text-center">
          {i18next.t("Sign Up")}
        </h1>
        
<form onSubmit={handleSubmit} className="space-y-3">

  {/* GRID: Two fields per row */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {fields.map((field) => (
      <div key={field.name} className="space-y-1">
        <label className="block text-xs font-semibold">{field.label}</label>

        <div className="relative">
          <input
            name={field.name}
            type={field.type || "text"}
            value={(formData as any)[field.name]}
            onChange={handleChange}
            placeholder={`Enter ${field.label}`}
            className={`form-input ps-9 w-full h-10 text-sm 
              placeholder:text-white-dark
              ${(errors[field.name] || apiErrors[field.name]) ? "border-red-500" : ""}
            `}
          />
          <span className="absolute start-3 top-1/2 -translate-y-1/2 text-white-dark text-sm">
            {field.icon}
          </span>
        </div>

        {(errors[field.name] || apiErrors[field.name]) && (
          <p className="text-red-500 text-xs mt-0.5">
            {errors[field.name] || apiErrors[field.name]}
          </p>
        )}
      </div>
    ))}
  </div>
  <div className="space-y-1">
  <label className="block text-xs font-semibold">
    Account Type
  </label>

  <select
    name="accountType"
    value={formData.accountType}
    onChange={handleChange}
    className="form-select w-full h-10 text-sm"
  >
    <option value="Student">Student</option>
    <option value="Instructor">Instructor</option>
  </select>
</div>

  {/* PHONE + COUNTRY CODE - Full Width */}
  <div className="space-y-1">
    <label className="block text-xs font-semibold">Phone</label>

    <div className="flex gap-2">
      <select
        className="border rounded-md bg-white text-black px-2 w-28 h-10 text-sm"
        value={formData.country_code}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            country_code: e.target.value,
          }))
        }
      >
        {countryOptions.map((country, idx) => (
          <option key={`${country.dialCode}-${idx}`} value={country.dialCode}>
            {country.dialCode} ({country.name})
          </option>
        ))}
      </select>

      <div className="relative flex-1">
        <input
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter Phone Number"
          className={`form-input ps-9 w-full h-10 text-sm
            ${(errors.phone || apiErrors.phone) ? "border-red-500" : ""}
          `}
        />
        <span className="absolute start-3 top-1/2 -translate-y-1/2 text-white-dark text-sm">
          <IconUser />
        </span>
      </div>
    </div>

    {(errors.phone || apiErrors.phone) && (
      <p className="text-red-500 text-xs mt-0.5">
        {errors.phone || apiErrors.phone}
      </p>
    )}
  </div>

  <button
    type="submit"
    disabled={loading}
    className="btn btn-gradient w-full mt-4 uppercase h-10 text-sm"
  >
    {loading ? "Registering..." : "Sign Up"}
  </button>
</form>

        

        <div className="text-center mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-primary underline">
            Sign In
          </Link>
        </div>
      </div>

      <ToastContainer autoClose={2000} theme="colored" />
    </div>
      <Footer />
    </>
    
  );
};

export default RegisterBoxed;
