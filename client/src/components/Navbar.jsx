import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="text-white font-bold text-lg tracking-tight">Team Task Management</Link>
        <div className="flex gap-6">
          <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm transition">Dashboard</Link>
          <Link to="/projects" className="text-gray-400 hover:text-white text-sm transition">Projects</Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-400 text-sm">{user?.name}</span>
        <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">{user?.role}</span>
        <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-400 transition">Logout</button>
      </div>
    </nav>
  );
}