import { useState } from "react";
import "../styles/Register.css";
import "../index.css";
import { Link, useNavigate } from "react-router";

interface FormData {
  username: string;
  password: string;
  email?: string;
}

const LS_KEY = "jwt";

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    email: "",
  });

  const [registerErrorMessage, setRegisterErrorMessage] = useState<string>("");
  const [registerSuccessMessage, setRegisterSuccessMessage] =
    useState<string>("");

  const navigate = useNavigate();

  const handleSubmitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterErrorMessage("");
    setRegisterSuccessMessage("");
    const response = await fetch("/api/registerUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();

    // Servern skickar tillbaka ett objekt: { success: boolean, token?: string }
    // TODO: validera med Zod att data variabeln matchar objektet

    if (data.success) {
      const jwt: string = data.token;
      localStorage.setItem(LS_KEY, jwt);
      setRegisterSuccessMessage("Registreringen lyckades!");
      setTimeout(() => navigate("/channels"), 800);
    } else {
      setRegisterErrorMessage("Registreringen misslyckades. Försök igen.");
    }
  };
  return (
    <div className="register-container">
      <div className="back-home">
        <Link to="/" className="back-link">
          Tillbaka
        </Link>
      </div>
      <div className="register-card">
        <h1>Register</h1>
        <form onSubmit={handleSubmitRegister} className="register-form">
          <input
            type="text"
            placeholder="Användarnamn"
            value={formData.username}
            onChange={(event) =>
              setFormData({ ...formData, username: event.target.value })
            }
          />

          <input
            type="password"
            placeholder="Lösenord"
            value={formData.password}
            onChange={(event) =>
              setFormData({ ...formData, password: event.target.value })
            }
          />

          <input
            type="email"
            placeholder="email"
            value={formData.email}
            onChange={(event) =>
              setFormData({ ...formData, email: event.target.value })
            }
          />

          <button type="submit" className="btn submit-btn">
            Register
          </button>
          {registerErrorMessage && (
            <span className="msg error"> {registerErrorMessage} </span>
          )}
          {registerSuccessMessage && (
            <span className="msg success"> {registerSuccessMessage} </span>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
