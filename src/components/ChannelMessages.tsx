import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "../styles/channelMessages.css";

//to fix !!! even though logged in, the public channels still show sender as a guest.
//timestamp is gonna be added

const ChannelMessages = () => {
  const { channelId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);
  const [channelName, setChannelName] = useState("");

  const token = localStorage.getItem("jwt");

  //Sends a GET request to /api/messages/channel/:channelId.
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
    console.log("API Response:", data);
    setMessages(data.messages || []);
    setLocked(Boolean(data.locked));
    setChannelName(data.name || "");
  }

  useEffect(() => {
    loadMessages();
  }, [channelId]);

  //Sends a POST request to the backend with { channelId, text }
  async function sendMessage(e: any) {
    e.preventDefault();
    if (!input.trim()) return;

    const res = await fetch("/api/messages/channel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      body: JSON.stringify({ channelId, text: input }),
    });

    if (!res.ok) {
      setError("Kunde inte skicka meddelande.");
      return;
    }

    setInput("");
    loadMessages();
  }

  return (
    <div className="channel-messages-wrapper">
      <h2># {channelName}</h2>

      {locked && <p>Låst kanal</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="channel-messages">
        {messages.map((m) => (
          <div key={m.SK} className="message-item">
            <strong>{m.username || m.userId || "Guest"}: </strong>

            {m.text}
          </div>
        ))}
      </div>

      {!error && (
        <form onSubmit={sendMessage}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ditt meddelande ..."
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
