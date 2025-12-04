import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/themeConfigSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";
import { Mail, Calendar, Clock, Shield } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfile = () => {
  const dispatch = useDispatch();

  // ---------------------
  // Cookies Helper
  // ---------------------
  const getCookie = (name) => {
    if (typeof document === "undefined") return "";
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return "";
  };

  const defaultAvatar =
    "https://t4.ftcdn.net/jpg/01/24/65/69/240_F_124656969_x3y8YVzvrqFZyv3YLWNo6PJaC88SYxqM.jpg";

  // ---------------------
  // Fetch avatar blob from backend
  // ---------------------
  const fetchAvatarImage = async (avatarId) => {
    if (!avatarId) return null;

    // Already a full URL → return as is
    if (avatarId.startsWith("http")) return avatarId;

    try {
      const response = await axios.get(
        `https://backend.onrequestlab.com/media/${avatarId}`,
        {
          responseType: "blob",
        }
      );

      return URL.createObjectURL(response.data);
    } catch (err) {
      console.error("Failed to load avatar:", err);
      return null;
    }
  };

  // ---------------------
  // STATES
  // ---------------------
  const [user, setUser] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    date_joined: "",
    last_active: "",
    is_active: false,
    is_staff: false,
    is_superuser: false,
    avatar: defaultAvatar,
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  // ---------------------
  // FETCH PROFILE
  // ---------------------
  useEffect(() => {
    dispatch(setPageTitle("Profile"));

    const fetchUser = async () => {
      try {
        let token = getCookie("access") || getCookie("jwt-auth") || "";
        token = token.replace("Bearer ", "").trim();

        const res = await axios.get(
          "https://backend.onrequestlab.com/api/v1/users/profile/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data;

        // Fetch avatar using GET /media/<id>
        const avatarUrl = await fetchAvatarImage(data.avatar);

        setUser({
          username: data.username,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          date_joined: data.date_joined,
          last_active: data.last_active,
          is_active: data.is_active,
          is_staff: data.is_staff,
          is_superuser: data.is_superuser,
          avatar: avatarUrl || defaultAvatar,
        });

        setFormData({
          username: data.username,
          first_name: data.first_name,
          last_name: data.last_name,
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Failed to load profile.");
      }
    };

    fetchUser();
  }, [dispatch]);

  // Format date
  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleString();
  };

  // Handle inputs
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ---------------------
  // LOCAL IMAGE PREVIEW
  // ---------------------
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // ---------------------
  // SAVE PROFILE + UPLOAD AVATAR
  // ---------------------
  const handleSave = async () => {
    try {
      let token = getCookie("access") || getCookie("jwt-auth") || "";
      token = token.replace("Bearer ", "").trim();

      const form = new FormData();
      form.append("username", formData.username);
      form.append("first_name", formData.first_name);
      form.append("last_name", formData.last_name);

      if (selectedImage) {
        form.append("avatar", selectedImage);
      }

      const res = await axios.post(
        "https://backend.onrequestlab.com/api/v1/users/profile/",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // New avatar returned by backend
      let newAvatar = res.data?.avatar
        ? await fetchAvatarImage(res.data.avatar)
        : user.avatar;

      setUser((prev) => ({
        ...prev,
        ...formData,
        avatar: previewImage || newAvatar,
      }));

      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err.response || err);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Navbar />

      <div className="flex-1 py-16 px-4 flex items-center">
        <div className="max-w-4xl mx-auto w-full">
          <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row gap-8">

            {/* Avatar Section */}
            <div className="flex-shrink-0 flex flex-col items-center w-full md:w-auto">
              <label className="cursor-pointer relative">
                <img
                  src={previewImage || user.avatar}
                  alt="Avatar"
                  className="w-40 h-40 rounded-full border-4 border-primary shadow-lg object-cover mb-4"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </label>

              {editMode ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="text-center rounded px-2 py-1 text-black mb-2 w-48"
                />
              ) : (
                <h2 className="text-2xl font-bold text-white">
                  {user.username}
                </h2>
              )}

              {editMode ? (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="rounded px-2 py-1 text-black w-24"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="rounded px-2 py-1 text-black w-24"
                    placeholder="Last Name"
                  />
                </div>
              ) : (
                <p className="text-white/70 mt-2">
                  {user.first_name} {user.last_name}
                </p>
              )}

              <button
                onClick={() => (editMode ? handleSave() : setEditMode(true))}
                className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition"
              >
                {editMode ? "Save" : "Edit Profile"}
              </button>
            </div>

            {/* Info Panel */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl shadow-md">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-white/60">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-white/60">Joined</p>
                  <p className="font-medium">{formatDate(user.date_joined)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-white/60">Last Active</p>
                  <p className="font-medium">{formatDate(user.last_active)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-white/60">Status</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user.is_active && (
                      <span className="px-2 py-1 text-xs bg-green-500 rounded-full">
                        Active
                      </span>
                    )}
                    {!user.is_active && (
                      <span className="px-2 py-1 text-xs bg-red-500 rounded-full">
                        Inactive
                      </span>
                    )}
                    {user.is_staff && (
                      <span className="px-2 py-1 text-xs bg-blue-500 rounded-full">
                        Staff
                      </span>
                    )}
                    {user.is_superuser && (
                      <span className="px-2 py-1 text-xs bg-yellow-500 text-black rounded-full">
                        Superuser
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;
