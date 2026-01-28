import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/allUsers.css";

type User = {
  userId: string;
  username: string;
};

function AllUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  //function to read and decode JWT to get current user info to delete
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const token = localStorage.getItem("jwt");
  let me: User | null = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      me = { userId: payload.userId, username: payload.username };
    } catch (err) {
      console.error("Failed to decode token", err);
    }
  }

  const navigate = useNavigate();

  //fetches data from backend endpoint /api/users
  useEffect(() => {
    (async () => {
      const result = await fetch("/api/users");
      const data = await result.json();
      setUsers(data);
      setLoading(false);
    })();
  }, []);

  // Delete self
  async function handleDeleteSelf(userId: string) {
    setBusyId(userId);
    setStatus("");
    try {
      const res = await fetch(`/api/delete/${userId}`, {
        method: "DELETE",
        headers: token ? { Authorization: "Bearer " + token } : {},
      });

      if (res.status === 204) {
        setUsers((prev) => prev.filter((u) => u.userId !== userId));
        setConfirmId(null);
        setStatus("Ditt konto har raderats.");
        // log the user out locally
        localStorage.removeItem("jwt");
        setTimeout(() => navigate("/"), 800);
        return;
      }
      if (res.status === 401) {
        setStatus("Du måste vara inloggad för att radera ditt konto.");
        navigate("/login");
        return;
      }
    } catch {
      setStatus("Nätverksfel vid radering.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="users-layout">
      <div className="back-to-channels">
        <Link to="/channels" className="back-link">
          Tillbaka
        </Link>
      </div>
      <div className="users-main">
        <h1 className="users-title">Alla Användare</h1>
        {status && <p className="users-status">{status}</p>}
        {loading && <p className="users-muted">Laddar…</p>}

        <div className="users-grid">
          {users.map((u) => {
            const isMe = me?.userId === u.userId;
            const isConfirming = confirmId === u.userId;

            return (
              <div key={u.userId} className="user-card">
                <div className="user-card-header">
                  <div className="user-avatar">
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name">{u.username}</span>
                </div>

                <div className="user-card-actions">
                  <Link className="user-dm-btn" to={`/dm/${u.userId}`}>
                    Skicka meddelande
                  </Link>

                  {isMe && (
                    <div className="user-delete">
                      {!isConfirming ? (
                        <button
                          className="btn btn-danger"
                          onClick={() => setConfirmId(u.userId)}
                          disabled={busyId === u.userId}>
                          Radera mitt konto
                        </button>
                      ) : (
                        <div className="confirm-row">
                          <button
                            className="btn-cancel"
                            onClick={() => setConfirmId(null)}
                            disabled={busyId === u.userId}>
                            Avbryt
                          </button>
                          <button
                            className="btn-danger"
                            onClick={() => handleDeleteSelf(u.userId)}
                            disabled={busyId === u.userId}>
                            Bekräfta
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AllUsers;
