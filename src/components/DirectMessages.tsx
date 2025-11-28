import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import "../styles/directMessages.css";
import chatIcon from "../assets/carbon_chat-bot.png";

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
      setUsers(data);
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

    //avoids sending empty messages
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
      <div className="left">
        <div className="dm-brand">
          <div className="chat-icon-dm">
            <img src={chatIcon} alt="" />
          </div>
          <div className="dm-appname">Chappy</div>
        </div>
        <div className="dm-list">
          <h2>Privata meddelande</h2>
          <div className="dm-people">
            {users.map((u) => (
              <Link
                key={u.userId}
                to={`/dm/${u.userId}`}
                className={
                  "dm-person" + (u.userId === withUserId ? " is-active" : "")
                }>
                {u.username}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* right side messages */}
      <div className="right">
        <div className="back-to-channels">
          <Link to="/channels" className="back-link">
            Tillbaka
          </Link>
        </div>
        {withUserId && (
          <>
            <div className="dm-thread">
              <h3>
                Chat with {users.find((u) => u.userId === withUserId)?.username}
              </h3>
              {messages.map((m) => {
                const sender =
                  users.find((u) => u.userId === m.senderId)?.username ||
                  m.senderId;
                const time = new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div key={m.SK}>
                    <div className="dm-bubble">
                      <div className="dm-box">
                        <span className="dm-who">{sender}</span>
                        <span className="dm-time">{time}</span>
                      </div>
                      <div className="dm-text">{m.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={send}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Skriv…"
                className="dm-inputbar"
              />
              <button type="submit" className="btn btn-primary dm-send">
                Skicka
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default DirectMessages;
