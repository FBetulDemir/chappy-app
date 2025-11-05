import { useState } from "react";
import "../styles/login.css";
import "../index.css";

interface FormData {
  username: string;
  password: string;
}

const LS_KEY = "jwt";

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  const [loginErrorMessage, setLoginErrorMessage] = useState<string>("");
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string>("");
  //   const [username, setUsername] = useState<string>("");
  //   const [password, setPassword] = useState<string>("");
  // const [users, setUsers] = useState<UserResponse[]>([])

  const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginErrorMessage("");
    setLoginSuccessMessage("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        setLoginErrorMessage("Felaktigt användarnamn eller lösenord!");
        return;
      }

      // Servern skickar tillbaka ett objekt: { success: boolean, token?: string }
      // TODO: validera med Zod att data variabeln matchar objektet
      const data = await response.json();

      if (data.success) {
        const jwt: string = data.token;
        localStorage.setItem(LS_KEY, jwt);

        console.log("Inloggningen lyckades", formData.username);
        setLoginSuccessMessage("Inloggningen lyckades!");
      } else {
        setLoginErrorMessage("Felaktigt användarnamn eller lösenord!");
        localStorage.removeItem(LS_KEY);
      }
    } catch (error) {
      setLoginErrorMessage("Nätverksfel. Försök igen.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>login</h1>
        <form onSubmit={handleSubmitLogin} className="login-form">
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

          <button type="submit" className="btn submit-btn">
            Logga in
          </button>
          {loginErrorMessage && (
            <span className="msg error"> {loginErrorMessage} </span>
          )}
          {loginSuccessMessage && (
            <span className="msg success"> {loginSuccessMessage} </span>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
