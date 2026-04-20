import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { logout } from "../api/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm, faListUl, faCheckCircle, faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function AppLayout({ children }) {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      logoutUser();
      navigate("/login");
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${isActive ? "bg-brand text-white" : "text-text-muted hover:bg-surface-alt hover:text-text"}`;

  return (
    <div className="min-h-screen bg-surface-alt flex flex-col">
      {/* Top Navbar */}
      <header className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎬</span>
          <span className="text-xl font-bold text-text">Movie Night</span>
        </div>

        {/* User menu */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-muted hidden md:block">
            Hey, <span className="font-medium text-text">{user?.name}</span>
          </span>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white text-sm font-bold overflow-hidden">
            {user?.avatar ? <img src={`http://movie-night.test/storage/${user.avatar}`} alt={user.name} className="w-full h-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
          </div>

          <button onClick={handleLogout} disabled={loggingOut} className="text-text-muted hover:text-brand transition-colors cursor-pointer" title="Logout">
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-surface border-r border-border p-4 hidden md:flex flex-col gap-1 sticky top-16 h-[calc(100vh-4rem)]">
          <NavLink to="/" end className={navLinkClass}>
            <FontAwesomeIcon icon={faFilm} />
            Browse
          </NavLink>
          <NavLink to="/watchlist" className={navLinkClass}>
            <FontAwesomeIcon icon={faListUl} />
            Watchlist
          </NavLink>
          <NavLink to="/watched" className={navLinkClass}>
            <FontAwesomeIcon icon={faCheckCircle} />
            Watched
          </NavLink>
          <NavLink to="/profile" className={navLinkClass}>
            <FontAwesomeIcon icon={faUser} />
            Profile
          </NavLink>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex justify-around py-3 z-50">
        <NavLink to="/" end className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? "text-brand" : "text-text-muted"}`}>
          <FontAwesomeIcon icon={faFilm} size="lg" />
          Browse
        </NavLink>
        <NavLink to="/watchlist" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? "text-brand" : "text-text-muted"}`}>
          <FontAwesomeIcon icon={faListUl} size="lg" />
          Watchlist
        </NavLink>
        <NavLink to="/watched" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? "text-brand" : "text-text-muted"}`}>
          <FontAwesomeIcon icon={faCheckCircle} size="lg" />
          Watched
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? "text-brand" : "text-text-muted"}`}>
          <FontAwesomeIcon icon={faUser} size="lg" />
          Profile
        </NavLink>
      </nav>
    </div>
  );
}
