import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const UserInfo = () => {
  const { email, logout } = useAuth();
  const navigate = useNavigate();

  if (!email) return null;

  const profileUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${email}`;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex items-center gap-4 bg-gray-100 px-3 py-2 rounded-full shadow-sm">
      <img
        src={profileUrl}
        alt="Profile"
        className="w-10 h-10 rounded-full border border-gray-300"
      />
      <div className="text-sm text-gray-800">{email}</div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default UserInfo;
