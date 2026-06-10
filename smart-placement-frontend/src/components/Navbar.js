import { Link, useLocation } from "react-router-dom";

function Navbar({ role }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <nav className="navbar">
      <Link to={role === "admin" ? "/dashboard" : "/student"} className="navbar-brand">
        <span className="brand-dot" />
        PlaceMe
      </Link>

      <div className="navbar-links">
        {role === "admin" ? (
          <>
            <Link to="/dashboard" className={isActive("/dashboard")}>Dashboard</Link>
            <Link to="/manage" className={isActive("/manage")}>Applications</Link>
          </>
        ) : (
          <Link to="/student" className={isActive("/student")}>Browse Jobs</Link>
        )}
      </div>

      <div className="navbar-right">
        <div className="user-chip">
          <div className="avatar">{initials}</div>
          <span>{user?.name || "User"}</span>
        </div>
        <button className="btn-logout" onClick={handleLogout}>Sign out</button>
      </div>
    </nav>
  );
}

export default Navbar;
