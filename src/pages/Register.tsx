import { useState } from "react";
import "../styles/Register.css";
import "../index.css";

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
      console.log("Registration lyckades", formData.username);
      setRegisterSuccessMessage("Registration lyckades!");
    } else {
      console.log("Registreringen misslyckades.");
      setRegisterErrorMessage("Registreringen misslyckades. Försök igen.");
    }
  };
  return (
    <div className="register-container">
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
