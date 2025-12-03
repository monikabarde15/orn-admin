import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Helper to get cookies
const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return '';
};

const Profile = () => {
  const dispatch = useDispatch();
  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

  const rawToken = getCookie("access") || getCookie("jwt-auth") || "";
  const csrftoken = getCookie("csrftoken") || "";

  const [profile, setProfile] = useState<any>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    location: '',
    avatar: 'https://via.placeholder.com/150', // Dummy centered image
  });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    dispatch(setPageTitle('Profile'));
    fetchProfile();
  }, []);

  // GET profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://backend.onrequestlab.com/api/v1/users/profile/', {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${rawToken}`,
        }
      });
      setProfile({ ...profile, ...response.data });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setLoading(false);
    }
  };

  // POST update profile
  const updateProfile = async () => {
    try {
      setUpdating(true);
      const response = await axios.post(
        'https://backend.onrequestlab.com/api/v1/users/profile/',
        {
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          role: profile.role,
          dob: profile.dob,
          location: profile.location,
        },
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${rawToken}`,
            'X-CSRFTOKEN': csrftoken
          },
        }
      );
          toast.success('Profile updated successfully!');

    //   alert('Profile updated successfully!');
      setProfile({ ...profile, ...response.data });
      setUpdating(false);
    } catch (error: any) {
      console.error('Failed to update profile:', error.response?.data || error.message);
    //   alert('Failed to update profile: ' + JSON.stringify(error.response?.data));
          toast.error('Failed to update profile: ' + JSON.stringify(error.response?.data));
      setUpdating(false);
    }
  };

  return (
    <div className="p-5 flex flex-col items-center">
      {/* Breadcrumb */}
      <ul className="flex space-x-2 rtl:space-x-reverse mb-5">
        <li><Link to="#" className="text-primary hover:underline">Users</Link></li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2"><span>Profile</span></li>
      </ul>

      {loading ? (
        <p>Loading profile...</p>
      ) : (
        <div className="panel p-6 w-full max-w-md flex flex-col items-center space-y-4 shadow-lg rounded-lg">
          {/* Dummy avatar centered */}
          <img
            src="https://t4.ftcdn.net/jpg/01/24/65/69/240_F_124656969_x3y8YVzvrqFZyv3YLWNo6PJaC88SYxqM.jpg"
            alt="Avatar"
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
          />

          {/* Editable fields */}
          <input
            type="text"
            value={profile.first_name}
            onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
            placeholder="First Name"
            className="input input-bordered w-full"
          />
          <input
            type="text"
            value={profile.last_name}
            onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
            placeholder="Last Name"
            className="input input-bordered w-full"
          />
          <input
            type="email"
            value={profile.email}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        
         
          {/* Update button */}
          <button
            onClick={updateProfile}
            disabled={updating}
            className="btn btn-primary flex items-center gap-2 w-full justify-center mt-3"
          >
            <IconPencilPaper /> {updating ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
