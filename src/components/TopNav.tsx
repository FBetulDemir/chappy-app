import { useNavigate } from "react-router-dom";
import "../styles/topNav.css";
import "../index.css";

const TopNav = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("jwt");
  let username = "Gäst";

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      username = payload.username || "Gäst";
    } catch {
      // Invalid token
    }
  }

  function handleLogout() {
    localStorage.removeItem("jwt");
    navigate("/login");
  }

  return (
    <header className="topnav">
      <div className="topnav-user">
        <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
        <span className="username">{username}</span>
      </div>
      <div className="topnav-container">
        <button
          className="btn-ghost"
          onClick={() => navigate("/createChannel")}>
          + Skapa kanal
        </button>
        <button className="btn-ghost btn-logout" onClick={handleLogout}>
          Logga ut
        </button>
      </div>
    </header>
  );
};

export default TopNav;
