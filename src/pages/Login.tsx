import { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {}
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Användarnamn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent border-white/30 text-white placeholder:text-white/50 focus:border-[#f7a73f]"
          />

          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=""
          />

          <button type="submit" className="">
            Logga in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
