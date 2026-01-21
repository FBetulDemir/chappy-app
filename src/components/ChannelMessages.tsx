import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import "../styles/channelMessages.css";

const ChannelMessages = () => {
  const { channelId } = useParams();

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  // // locked = requires auth
  // const [locked, setLocked] = useState(false);

  // accessDenied = got 401
  const [accessDenied, setAccessDenied] = useState(false);

  const [channelName, setChannelName] = useState("");

  const reqSeq = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  // const token = localStorage.getItem("jwt");
  // const isLoggedIn = !!token;

  async function loadMessages(id?: string) {
    const cid = id ?? channelId;
    if (!cid) return;

    reqSeq.current += 1;
    const seq = reqSeq.current;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // clear stale UI immediately
    setError("");
    setAccessDenied(false);
    setMessages([]);
    setChannelName("");
    setLocked(false);

    try {
      const res = await fetch(`/api/messages/channel/${cid}`, {
        headers: token ? { Authorization: "Bearer " + token } : {},
        signal: controller.signal,
      });

      if (seq !== reqSeq.current) return;

      if (res.status === 401) {
        setAccessDenied(true);
        setLocked(true);
        setMessages([]);
        setChannelName("");
        setError("Denna kanal är låst. Du måste logga in.");
        return;
      }

      if (res.status === 404) {
        setAccessDenied(false);
        setLocked(false);
        setMessages([]);
        setChannelName("");
        setError("Kanal hittades inte");
        return;
      }

      if (!res.ok) {
        setAccessDenied(false);
        setMessages([]);
        setChannelName("");
        setError("Kunde inte hämta meddelanden.");
        return;
      }

      const data = await res.json();
      if (seq !== reqSeq.current) return;

      setMessages(data.messages || []);
      setLocked(Boolean(data.locked));
      setChannelName(data.name || "");
      setAccessDenied(false);
      setError("");
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      if (seq !== reqSeq.current) return;

      setAccessDenied(false);
      setMessages([]);
      setChannelName("");
      setError("Något gick fel vid hämtning av kanalen.");
    }
  }

  useEffect(() => {
    loadMessages(channelId);
    return () => abortRef.current?.abort();
  }, [channelId]);

  async function sendMessage(e: any) {
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
      setLocked(true);
      setMessages([]);
      setError("Denna kanal är låst. Du måste logga in.");
      return;
    }

    if (!res.ok) {
      setError("Kunde inte skicka meddelande.");
      return;
    }

    setInput("");
    loadMessages(channelId);
  }

  return (
    <div className="channel-messages-wrapper">
      <h2># {channelName}</h2>

      {error && (
        <p
          style={{
            color: "red",
            margin: "2em",
            backgroundColor: "transparent",
          }}>
          {error}
        </p>
      )}

      <div className="channel-messages">
        {messages.map((m) => (
          <div key={m.SK ?? m.messageId} className="message-item">
            <strong>{m.username || m.userId || "Guest"}: </strong>
            {m.text}
          </div>
        ))}
      </div>

      {/* block the form only if no access */}
      {!accessDenied && (
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
