import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

type User = {
  userId: string;
  username: string;
};
type DM = {
  SK: string;
  senderId: string;
  text: string;
  createdAt: string;
};

const DirectMessages = () => {
  const { withUserId } = useParams();
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<DM[]>([]);
  const [text, setText] = useState("");

  const token = localStorage.getItem("jwt");

  // Load all users
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      const cleaned = data.map((u: any) => ({
        userId: u.userId ?? u.SK.replace("USER#", ""),
        username: u.username,
      }));
      setUsers(cleaned);
    })();
  }, []);

  // Load messages with selected user
  useEffect(() => {
    if (!withUserId) return;
    (async () => {
      const res = await fetch(`/api/messages/dm/${withUserId}`, {
        headers: token ? { Authorization: "Bearer " + token } : {},
      });

      const data = await res.json();
      setMessages(data || []);
    })();
  }, [withUserId]);

  // Send message
  async function send(e: any) {
    e.preventDefault();
    if (!text.trim()) return;

    await fetch(`/api/messages/dm/${withUserId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      body: JSON.stringify({ text }),
    });

    setText("");

    // Reload messages
    const res = await fetch(`/api/messages/dm/${withUserId}`, {
      headers: token ? { Authorization: "Bearer " + token } : {},
    });
    setMessages(await res.json());
  }
  return (
    <div className="dm-container">
      <h1>DM</h1>
      <div>
        <h3>Välj en användare</h3>
        {users.map((u) => (
          <div key={u.userId}>
            <Link to={`/dm/${u.userId}`}>{u.username}</Link>
          </div>
        ))}
      </div>

      <hr />

      {/* right side messages */}
      {withUserId && (
        <>
          <h3>
            Chat with {users.find((u) => u.userId === withUserId)?.username}
          </h3>

          <div>
            {messages.map((m) => (
              <div key={m.SK}>
                <strong>{m.senderId}:</strong> {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={send}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Skriv…"
            />
            <button type="submit" className="btn">
              Skicka
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default DirectMessages;
