import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import "../styles/channelMessages.css";

interface Message {
  SK?: string;
  messageId?: string;
  userId?: string;
  username?: string;
  text: string;
  createdAt?: string;
}

const ChannelMessages = () => {
  const { channelId } = useParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [channelName, setChannelName] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);

  const token = localStorage.getItem("jwt");

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  // Initial load - clears state and shows loading
  async function loadMessages(cid: string) {
    setError("");
    setAccessDenied(false);
    setMessages([]);
    setChannelName("");
    setLoading(true);
    prevMessageCountRef.current = 0;

    await fetchMessages(cid);
    setLoading(false);
  }

  // Fetch messages without clearing state (used for polling)
  async function fetchMessages(cid: string) {
    try {
      const res = await fetch(`/api/messages/channel/${cid}`, {
        headers: token ? { Authorization: "Bearer " + token } : {},
      });

      if (res.status === 401) {
        setAccessDenied(true);
        setMessages([]);
        setChannelName("");
        setError("Denna kanal är låst. Du måste logga in.");
        return;
      }

      if (res.status === 404) {
        setAccessDenied(false);
        setMessages([]);
        setChannelName("");
        setError("Kanal hittades inte");
        return;
      }

      if (!res.ok) {
        setError("Kunde inte hämta meddelanden.");
        return;
      }

      const data = await res.json();
      const newMessages = data.messages || [];

      setMessages(newMessages);
      setChannelName(data.name || "");
      setAccessDenied(false);
      setError("");

      // Only scroll to bottom if new messages arrived
      if (newMessages.length > prevMessageCountRef.current) {
        setTimeout(scrollToBottom, 50);
      }
      prevMessageCountRef.current = newMessages.length;

    } catch {
      // Silent fail for polling - don't clear messages on network error
    }
  }

  // Load on channel change
  useEffect(() => {
    if (channelId) {
      loadMessages(channelId);
    }
  }, [channelId]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    if (!channelId || accessDenied) return;

    const interval = setInterval(() => {
      fetchMessages(channelId);
    }, 5000);

    return () => clearInterval(interval);
  }, [channelId, accessDenied, token]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !channelId) return;

    const res = await fetch("/api/messages/channel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      body: JSON.stringify({ channelId, text: input }),
    });

    if (res.status === 401) {
      setAccessDenied(true);
      setMessages([]);
      setError("Denna kanal är låst. Du måste logga in.");
      return;
    }

    if (!res.ok) {
      setError("Kunde inte skicka meddelande.");
      return;
    }

    setInput("");
    // Fetch immediately after sending
    fetchMessages(channelId);
  }

  function formatTime(dateStr?: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="channel-messages-wrapper">
      <h2># {channelName}</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="channel-messages">
        {loading && messages.length === 0 && (
          <div className="loading-indicator">Laddar meddelanden...</div>
        )}

        {!loading && messages.length === 0 && !error && (
          <div className="empty-state">
            <p>Inga meddelanden än. Var först att skriva!</p>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.SK ?? m.messageId} className="message-item">
            <div className="message-header">
              <span className="username">
                {m.username || m.userId || "Gäst"}
              </span>
              <span className="timestamp">{formatTime(m.createdAt)}</span>
            </div>
            <div className="text">{m.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {!accessDenied && (
        <form onSubmit={sendMessage}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Skriv ett meddelande..."
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
