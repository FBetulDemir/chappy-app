import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "../styles/channelMessages.css";

const ChannelMessages = () => {
  const { channelId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);

  // Load JWT if logged in
  const token = localStorage.getItem("jwt");

  // Fetch messages for channel
  async function loadMessages() {
    setError("");

    const res = await fetch(`/api/messages/channel/${channelId}`, {
      headers: token ? { Authorization: "Bearer " + token } : {},
    });

    if (res.status === 401) {
      setError("Denna kanal är låst. Du måste logga in.");
      return;
    }
    if (res.status === 404) {
      setError("Kanal hittades inte");
      return;
    }

    const data = await res.json();
    setMessages(data.messages || []);
    setLocked(data.locked);
  }

  useEffect(() => {
    loadMessages();
  }, [channelId]);

  // Send new message
  async function sendMessage(e: any) {
    e.preventDefault();
    if (!input.trim()) return;

    const res = await fetch("/api/messages/channel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      body: JSON.stringify({
        channelId,
        text: input,
      }),
    });

    if (!res.ok) {
      setError("Kunde inte skicka meddelande.");
      return;
    }

    setInput("");
    // reload message list
    loadMessages();
  }

  return (
    <div className="channel-messages-wrapper">
      <h2># {channelId}</h2>

      {locked && <p>Låst kanal</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Message list */}
      <div className="channel-messages">
        {messages.map((m) => (
          <div key={m.SK}>
            <strong>{m.userId}: </strong>
            {m.text}
            {/* <div className="time-stamp">{createdAt}</div> */}
          </div>
        ))}
      </div>

      {/* Message input */}
      {!error && (
        <form onSubmit={sendMessage}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Skriv ett meddelande…"
          />
          <button type="submit" className="btn">
            Skicka
          </button>
        </form>
      )}
    </div>
  );
};

export default ChannelMessages;
