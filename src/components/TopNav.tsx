import { useNavigate } from "react-router-dom";
import "../styles/topNav.css";

const TopNav = () => {
  const navigate = useNavigate();
  return (
    <header>
      <div className="topnav-container">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/createChannel")}>
          Skapa kanal
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/register")}>
          Logga ut
        </button>
      </div>
    </header>
  );
};

export default TopNav;
