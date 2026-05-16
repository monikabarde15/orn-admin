import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IRootState } from "../../store";
import { setPageTitle } from "../../store/themeConfigSlice";
import IconPencilPaper from "../../components/Icon/IconPencilPaper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../services/api";

const Profile = () => {
  const dispatch = useDispatch();

  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === "rtl";

  const [profile, setProfile] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    avatar:
      "https://t4.ftcdn.net/jpg/01/24/65/69/240_F_124656969_x3y8YVzvrqFZyv3YLWNo6PJaC88SYxqM.jpg",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/api/v1/profile/getUserDetails"
      );

      const user = res.data.data;

      setProfile({
        first_name: user.firstName || "",
        last_name: user.lastName || "",
        email: user.email || "",
        avatar:
          user.image ||
          "https://t4.ftcdn.net/jpg/01/24/65/69/240_F_124656969_x3y8YVzvrqFZyv3YLWNo6PJaC88SYxqM.jpg",
      });

    } catch (err) {
      console.error("Failed to fetch profile:", err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE PROFILE ================= */
  const updateProfile = async () => {
    try {
      setUpdating(true);

      // update name
      await api.put(
        "/api/v1/profile/updateProfile",
        {
          firstName: profile.first_name,
          lastName: profile.last_name,
        }
      );

      // update image
      if (profile.profile_image instanceof File) {
        const formData = new FormData();

        formData.append(
          "displayPicture",
          profile.profile_image
        );

        await api.put(
          "/api/v1/profile/updateDisplayPicture",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      toast.success("Profile updated successfully!");

      fetchProfile();

    } catch (err: any) {
      console.error("Profile update failed:", err);

      toast.error(
        err.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    dispatch(setPageTitle("Profile"));
    fetchProfile();
  }, []);

  return (
    <div className="p-5 flex flex-col items-center">
      <ToastContainer
        position="top-center"
        autoClose={2000}
      />

      {/* Breadcrumb */}
     

      {loading ? (
        <p className="text-gray-500">
          Loading profile...
        </p>
      ) : (
        <div className="panel p-6 w-full max-w-md flex flex-col items-center space-y-4 shadow-lg rounded-lg">

          {/* Avatar */}
          <img
            src={profile.avatar}
            alt="Avatar"
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
          />

          {/* Upload Image */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (!file) return;

              setProfile((prev: any) => ({
                ...prev,
                profile_image: file,
                avatar: URL.createObjectURL(file),
              }));
            }}
            className="input input-bordered w-full"
          />

          {/* First Name */}
          <input
            type="text"
            value={profile.first_name || ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                first_name: e.target.value,
              })
            }
            placeholder="First Name"
            className="input input-bordered w-full"
          />

          {/* Last Name */}
          <input
            type="text"
            value={profile.last_name || ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                last_name: e.target.value,
              })
            }
            placeholder="Last Name"
            className="input input-bordered w-full"
          />

          {/* Email */}
          <input
            type="email"
            value={profile.email || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
          />

          {/* Update Button */}
          <button
            onClick={updateProfile}
            disabled={updating}
            className="btn btn-primary flex items-center gap-2 w-full justify-center mt-3"
          >
            <IconPencilPaper />

            {updating
              ? "Updating..."
              : "Update Profile"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;