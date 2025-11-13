import { useNavigate } from "react-router-dom";
import "../styles/topNav.css";
import "../index.css";

const TopNav = () => {
  const navigate = useNavigate();

  //logout function
  function handleLogout() {
    // Remove stored token
    localStorage.removeItem("jwt");
    navigate("/login");
  }

  return (
    <header className="topnav">
      <div className="topnav-container">
        <button
          className="btn-ghost"
          onClick={() => navigate("/createChannel")}>
          Skapa kanal
        </button>

        <button className="btn-ghost" onClick={handleLogout}>
          Logga ut
        </button>
      </div>
    </header>
  );
};

export default TopNav;
