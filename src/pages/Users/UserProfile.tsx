import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/themeConfigSlice";
import { useEffect, useState } from "react";
import Navbar from "../../pages/Components/Navbar";
import Footer from "../Components/Footer";
import { Mail, Calendar, Clock, Shield } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../services/api";

const DEFAULT_AVATAR =
  "https://t4.ftcdn.net/jpg/01/24/65/69/240_F_124656969_x3y8YVzvrqFZyv3YLWNo6PJaC88SYxqM.jpg";

const normalizeImageUrl = (url?: string) => {
  if (!url) return DEFAULT_AVATAR;
  if (url.startsWith("http")) return url;
  return `https://${url}`;
};

const UserProfile = () => {
  const dispatch = useDispatch();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");

  /* ---------------- FETCH PROFILE ---------------- */
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/v1/users/profile/");
      const data = res.data;

      setUser({
        ...data,
        profile_image: normalizeImageUrl(data.profile_image),
      });

      setFormData({
        username: data.username || "",
        first_name: data.first_name || "",
        last_name: data.last_name || "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(setPageTitle("Profile"));
    fetchProfile();
  }, []);

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleString() : "-";

  const handleChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageSelect = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      const form = new FormData();
      form.append("username", formData.username);
      form.append("first_name", formData.first_name);
      form.append("last_name", formData.last_name);

      if (selectedImage) {
        form.append("profile_image", selectedImage);
      }

      const res = await api.patch(
        "/api/v1/users/profile/update/",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updated = res.data;

      setUser((prev: any) => ({
        ...prev,
        ...updated,
        profile_image:
          previewImage || normalizeImageUrl(updated.profile_image),
      }));

      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Navbar />

      <div className="flex-1 py-10 sm:py-16 px-3 sm:px-4 flex items-center">
        <div className="max-w-6xl xl:max-w-7xl mx-auto w-full">

          {/* MAIN CARD */}
          <div className="bg-white/5 border border-white/20 rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-xl shadow-xl">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

              {/* LEFT - PROFILE */}
              <div className="flex flex-col items-center lg:items-start">

                <label className="cursor-pointer">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-primary mb-4">
                    <img
                      src={previewImage || user.profile_image || DEFAULT_AVATAR}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.currentTarget.src = DEFAULT_AVATAR)
                      }
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
                      className="mb-2 px-3 py-2 rounded w-full"
                    />

                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <input
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="px-3 py-2 rounded w-full"
                        placeholder="First name"
                      />
                      <input
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="px-3 py-2 rounded w-full"
                        placeholder="Last name"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-white text-xl sm:text-2xl font-bold text-center lg:text-left">
                      {user.username}
                    </h2>
                    <p className="text-white/70 text-center lg:text-left">
                      {user.first_name} {user.last_name}
                    </p>
                  </>
                )}

                <button
                  onClick={() =>
                    editMode ? handleSave() : setEditMode(true)
                  }
                  className="mt-4 px-5 py-2 bg-primary text-white rounded-lg w-full sm:w-auto"
                >
                  {editMode ? "Save" : "Edit Profile"}
                </button>
              </div>

              {/* RIGHT - INFO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:col-span-2 text-white">

                <Info icon={<Mail />} label="Email" value={user.email} />

                <Info
                  icon={<Calendar />}
                  label="Joined"
                  value={formatDate(user.date_joined)}
                />

                <Info
                  icon={<Clock />}
                  label="Last Active"
                  value={formatDate(user.last_active)}
                />

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
      </div>

      <Footer />
    </div>
  );
};

/* ---------------- INFO CARD ---------------- */
const Info = ({ icon, label, value }: any) => (
  <div className="flex items-start gap-3 bg-white/10 p-3 sm:p-4 rounded-xl w-full min-w-0">
    <div className="text-primary mt-1">{icon}</div>

    <div className="break-words w-full">
      <p className="text-xs sm:text-sm text-white/60">{label}</p>
      <p className="text-sm sm:text-base break-all">{value}</p>
    </div>
  </div>
);

export default UserProfile;