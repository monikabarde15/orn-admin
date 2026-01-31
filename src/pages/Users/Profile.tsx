import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { setPageTitle } from "../../store/themeConfigSlice";
import IconPencilPaper from "../../components/Icon/IconPencilPaper";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VIT = import.meta.env.VITE_API_URL;

// cookie helper
const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : "";
};

const Profile = () => {
  const dispatch = useDispatch();

  const [profile, setProfile] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "",
    avatar: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    dispatch(setPageTitle("Profile"));
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = getCookie("access") || getCookie("jwt-auth");

      const res = await axios.get(`${VIT}/api/v1/users/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;

      setProfile({
        ...data,
        avatar: data.profile_image
          ? data.profile_image.startsWith("http")
            ? data.profile_image
            : `${VIT}${data.profile_image}`
          : "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  /* ================= IMAGE CHANGE ================= */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    try {
      const token = getCookie("access") || getCookie("jwt-auth");
      if (!token) {
        toast.error("Authentication token missing");
        return;
      }

      setUpdating(true);

      const form = new FormData();
      form.append("first_name", profile.first_name);
      form.append("last_name", profile.last_name);
      form.append("phone", profile.phone || "");
      form.append("location", profile.location || "");

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

      const updated = res.data;

      setProfile((prev: any) => ({
        ...prev,
        ...updated,
        avatar: updated.profile_image
          ? updated.profile_image.startsWith("http")
            ? updated.profile_image
            : `${VIT}${updated.profile_image}`
          : prev.avatar,
      }));

      setPreviewImage(null);
      setSelectedImage(null);

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };
const getImageUrl = (url?: string) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
};

  /* ================= UI ================= */
  return (
    <div className="p-5 flex flex-col items-center">
      {/* Breadcrumb */}
      <ul className="flex space-x-2 mb-5">
        <li>
          <Link to="#" className="text-primary hover:underline">
            Users
          </Link>
        </li>
        <li className="before:content-['/'] before:mx-2">
          <span>Profile</span>
        </li>
      </ul>

      {loading ? (
        <p>Loading profile...</p>
      ) : (
        <div className="panel p-6 w-full max-w-md flex flex-col items-center space-y-4 shadow-lg rounded-lg">
          {/* Avatar */}
          <label className="cursor-pointer">
            <img
              src={
                previewImage ||
                getImageUrl(profile.profile_image) ||
                "https://via.placeholder.com/150"
              }
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {/* Inputs */}
          <input
            type="text"
            value={profile.first_name}
            onChange={(e) =>
              setProfile({ ...profile, first_name: e.target.value })
            }
            placeholder="First Name"
            className="input input-bordered w-full"
          />

          <input
            type="text"
            value={profile.last_name}
            onChange={(e) =>
              setProfile({ ...profile, last_name: e.target.value })
            }
            placeholder="Last Name"
            className="input input-bordered w-full"
          />

          <input
            type="email"
            value={profile.email}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={updating}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <IconPencilPaper />
            {updating ? "Updating..." : "Update Profile"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
