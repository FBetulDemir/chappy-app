import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/allUsers.css";

type User = {
  userId: string;
  username: string;
};

function AllUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await fetch("/api/users");
      const raw = await result.json();
      const cleaned = (raw || []).map((u: any) => ({
        userId: u.userId ?? u.SK?.replace("USER#", ""),
        username: u.username,
      }));
      setUsers(cleaned);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="users-layout">
      <div className="users-main">
        <h1 className="users-title">Alla Användare</h1>
        {loading && <p className="users-muted">Laddar…</p>}

        <div className="users-grid">
          {users.map((u) => (
            <div key={u.userId} className="user-card">
              <div className="user-avatar">👤</div>
              <h2 className="user-name">{u.username}</h2>
              <Link className="user-dm-btn" to={`/dm/${u.userId}`}>
                Skicka meddelande
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllUsers;
