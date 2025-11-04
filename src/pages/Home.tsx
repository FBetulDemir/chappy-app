import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import chatIcon from "../assets/carbon_chat-bot.png";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <div className="home-card">
        <div className="chat-icon">
          <img src={chatIcon} alt="" />
        </div>
        <h1>Välkommen till Chappy!</h1>

        <button className="btn btn-primary" onClick={() => navigate("/login")}>
          Logga in
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/register")}>
          Registrera dig
        </button>

        <p className="divider">eller</p>

        <button
          className="btn btn-guest"
          onClick={() => navigate("/channels?guest=true")}>
          Fortsätt som gäst
        </button>
      </div>
    </div>
  );
};

export default Home;
