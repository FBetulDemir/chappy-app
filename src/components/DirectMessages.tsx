import { useEffect, useRef, useState } from "react";
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
  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem("jwt");

  let currentUserId = "";
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      currentUserId = payload.userId || "";
    } catch {
      // Invalid token
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  // Load all users
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    })();
  }, []);

  // Load messages with selected user
  async function loadMessages() {
    if (!withUserId) return;

    const res = await fetch(`/api/messages/dm/${withUserId}`, {
      headers: token ? { Authorization: "Bearer " + token } : {},
    });

    if (res.ok) {
      const data = await res.json();
      setMessages(data || []);
    }
  }

  useEffect(() => {
    loadMessages();
  }, [withUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Poll for new messages
  useEffect(() => {
    if (!withUserId) return;

    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [withUserId]);

  // Send message
  async function send(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!text.trim()) return;

    const res = await fetch(`/api/messages/dm/${withUserId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        setError("Du måste vara inloggad för att skicka meddelanden.");
      } else {
        setError("Kunde inte skicka meddelandet.");
      }
      return;
    }

    setText("");
    loadMessages();
  }

  function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="dm-container">
      <div className="left">
        <div className="dm-brand">
          <div className="chat-icon-dm">
            <img src={chatIcon} alt="Chappy" />
          </div>
          <div className="dm-appname">Chappy</div>
        </div>
        <div className="dm-list">
          <h2>Privata meddelanden</h2>
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

      <div className="right">
        <div className="back-to-channels">
          <Link to="/channels" className="back-link">
            Tillbaka till kanaler
          </Link>
        </div>

        {withUserId ? (
          <>
            <div className="dm-thread">
              <h3>
                Chat med {users.find((u) => u.userId === withUserId)?.username}
              </h3>

              {messages.length === 0 && (
                <div className="dm-empty">
                  <p>Inga meddelanden än. Starta konversationen!</p>
                </div>
              )}

              {messages.map((m) => {
                const sender =
                  users.find((u) => u.userId === m.senderId)?.username ||
                  m.senderId;
                const isMe = m.senderId === currentUserId;

                return (
                  <div key={m.SK} className={`dm-bubble ${isMe ? "me" : ""}`}>
                    <div className="dm-box">
                      <span className="dm-who">{sender}</span>
                      <span className="dm-time">{formatTime(m.createdAt)}</span>
                    </div>
                    <div className="dm-text">{m.text}</div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {error && (
              <div
                style={{
                  padding: "0.75em 1.5em",
                  background: "var(--error-bg)",
                  color: "var(--error)",
                  borderTop: "1px solid var(--error)",
                }}>
                {error}
              </div>
            )}

            <form onSubmit={send}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Skriv ett meddelande..."
                className="dm-inputbar"
              />
              <button type="submit" className="btn btn-primary dm-send">
                Skicka
              </button>
            </form>
          </>
        ) : (
          <div className="dm-empty" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p>Välj en person att chatta med</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectMessages;
