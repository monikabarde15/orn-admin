import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/themeConfigSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";
import { Mail, Calendar, Clock, Shield } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VIT = import.meta.env.VITE_API_URL;
const normalizeImageUrl = (url) => {
  if (!url) return DEFAULT_AVATAR;

  // already absolute
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // CDN URL without protocol
  return `https://${url}`;
};


const DEFAULT_AVATAR =
  "https://t4.ftcdn.net/jpg/01/24/65/69/240_F_124656969_x3y8YVzvrqFZyv3YLWNo6PJaC88SYxqM.jpg";

const UserProfile = () => {
  const dispatch = useDispatch();

  // ---------------------
  // Cookie Helper
  // ---------------------
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return "";
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
    profile_image: DEFAULT_AVATAR,
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
        let token = getCookie("access") || getCookie("jwt-auth");
        if (!token) {
          toast.error("Authentication token missing");
          return;
        }

        const res = await axios.get(
          `${VIT}/api/v1/users/profile/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );


        const data = res.data;

      const avatarUrl = normalizeImageUrl(data.profile_image);

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
        profile_image: avatarUrl,
      });


        setFormData({
          username: data.username,
          first_name: data.first_name,
          last_name: data.last_name,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      }
    };

    fetchUser();
  }, [dispatch]);

  // ---------------------
  // Helpers
  // ---------------------
  const formatDate = (date) =>
    date ? new Date(date).toLocaleString() : "";

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ---------------------
  // IMAGE PREVIEW
  // ---------------------
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // ---------------------
  // SAVE PROFILE
  // ---------------------
  const handleSave = async () => {
    try {
      let token = getCookie("access") || getCookie("jwt-auth");
      if (!token) {
        toast.error("Authentication token missing");
        return;
      }

      const form = new FormData();
      form.append("username", formData.username);
      form.append("first_name", formData.first_name);
      form.append("last_name", formData.last_name);

      if (selectedImage) {
        form.append("profile_image", selectedImage);
      }

      const res = await axios.patch(
        `${VIT}/api/v1/users/profile/update/`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      let avatarUrl = user.profile_image;
      if (res.data.profile_image) {
        avatarUrl = res.data.profile_image.startsWith("http")
          ? res.data.profile_image
          : `${VIT}${res.data.profile_image}`;
      }

      setUser((prev) => ({
        ...prev,
        ...formData,
        profile_image: previewImage || avatarUrl,
      }));

      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  // ---------------------
  // RENDER
  // ---------------------
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Navbar />

      <div className="flex-1 py-16 px-4 flex items-center">
        <div className="max-w-4xl mx-auto w-full">
          <div className="bg-white/5 border border-white/20 rounded-3xl p-8 flex flex-col md:flex-row gap-8">

            {/* Avatar */}
            <div className="flex flex-col items-center">
              <label className="cursor-pointer">
               <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary mb-4">
  <img
    src={previewImage || user.profile_image || DEFAULT_AVATAR}
    alt="Avatar"
    className="w-full h-full object-cover object-center"
    onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
  />
</div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </label>

              {editMode ? (
                <>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="mb-2 px-2 py-1 rounded"
                  />
                  <div className="flex gap-2">
                    <input
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="px-2 py-1 rounded"
                      placeholder="First"
                    />
                    <input
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="px-2 py-1 rounded"
                      placeholder="Last"
                    />
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-white text-2xl font-bold">
                    {user.username}
                  </h2>
                  <p className="text-white/70">
                    {user.first_name} {user.last_name}
                  </p>
                </>
              )}

              <button
                onClick={() => (editMode ? handleSave() : setEditMode(true))}
                className="mt-4 px-4 py-2 bg-primary text-white rounded"
              >
                {editMode ? "Save" : "Edit Profile"}
              </button>
            </div>

            {/* Info */}
            <div className="grid md:grid-cols-2 gap-6 text-white flex-1">
              <Info icon={<Mail />} label="Email" value={user.email} />
              <Info icon={<Calendar />} label="Joined" value={formatDate(user.date_joined)} />
              <Info icon={<Clock />} label="Last Active" value={formatDate(user.last_active)} />
              <Info
                icon={<Shield />}
                label="Status"
                value={
                  <>
                    {user.is_active ? "Active" : "Inactive"}
                    {user.is_staff && " | Staff"}
                    {user.is_superuser && " | Superuser"}
                  </>
                }
              />
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Small Info Card
const Info = ({ icon, label, value }) => (
  <div className="flex gap-3 bg-white/10 p-4 rounded-xl">
    <div className="text-primary">{icon}</div>
    <div>
      <p className="text-sm text-white/60">{label}</p>
      <p>{value}</p>
    </div>
  </div>
);

export default UserProfile;
