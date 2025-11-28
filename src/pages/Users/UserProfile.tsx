import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/themeConfigSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import IconCoffee from "../../components/Icon/IconCoffee";
import IconCalendar from "../../components/Icon/IconCalendar";
import IconMapPin from "../../components/Icon/IconMapPin";
import IconMail from "../../components/Icon/IconMail";
import IconPhone from "../../components/Icon/IconPhone";
import IconTwitter from "../../components/Icon/IconTwitter";
import IconDribbble from "../../components/Icon/IconDribbble";
import IconGithub from "../../components/Icon/IconGithub";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";

const UserProfile = () => {
  const dispatch = useDispatch();
   const getCookie = (name) => {
    if (typeof document === "undefined") return "";
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return "";
  };
  
  const userNew = {
    name: getCookie("username"),
    email: getCookie("email"),
  };
  const [user, setUser] = useState({
    name: userNew.name,//"User Name",
    // email: "email@example.com",
    // role: "Web Developer",
    // dob: "Jan 01, 1990",
    // location: "Unknown",
    // phone: "+1 (000) 000-0000",
    avatar: "/assets/images/profile-34.jpeg",
  });

 
  useEffect(() => {
    dispatch(setPageTitle("Profile"));

    const fetchUser = async () => {
      try {
        let rawToken =
          getCookie("access") ||
          getCookie("jwt-auth") 
          "";

        rawToken = rawToken.replace("Bearer ", "").trim();

        const res = await axios.get(
          "https://backend.onrequestlab.com/api/v1/users/auth/user/",
          {
            headers: {
              Authorization: `Bearer ${rawToken}`,
            },
          }
        );

        const data = res.data;
        console.log('data=',data);
        setUser((prev) => ({
          ...prev,
          name: data.username || '',
        }));
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [dispatch]);
  console.log('user=',user);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="flex flex-col items-center">
              <img
                src={user.avatar}
                className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-primary mb-4"
                alt="profile"
              />

              <h3 className="text-2xl font-bold text-white mb-2">{userNew.name}</h3>
              {/* <p className="text-white/70 mb-6">{user.role}</p> */}

              {/* <ul className="mt-4 space-y-4 text-white font-medium text-lg text-center">
                <li className="flex items-center gap-3 justify-center">
                  <IconCoffee /> {user.role}
                </li>
                <li className="flex items-center gap-3 justify-center">
                  <IconCalendar /> {user.dob}
                </li>
                <li className="flex items-center gap-3 justify-center">
                  <IconMapPin /> {user.location}
                </li>
                <li className="flex items-center gap-3 justify-center">
                  <IconMail className="w-5 h-5" />{" "}
                  <span className="text-primary">{user.email}</span>
                </li>
                <li className="flex items-center gap-3 justify-center">
                  <IconPhone /> {user.phone}
                </li>
              </ul> */}

              {/* <div className="flex items-center justify-center gap-4 mt-6">
                <button className="btn btn-info rounded-full w-10 h-10 p-0 hover:scale-110 transition">
                  <IconTwitter />
                </button>
                <button className="btn btn-danger rounded-full w-10 h-10 p-0 hover:scale-110 transition">
                  <IconDribbble />
                </button>
                <button className="btn btn-dark rounded-full w-10 h-10 p-0 hover:scale-110 transition">
                  <IconGithub />
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default UserProfile;
