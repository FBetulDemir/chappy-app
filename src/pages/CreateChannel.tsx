import { useState } from "react";
import { useNavigate } from "react-router";
import "../styles/createChannel.css";

const CreateChannel = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [locked, setLocked] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("jwt");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Kanalnamn krävs.");
      return;
    }

    try {
      const res = await fetch("/api/channels/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: "Bearer " + token } : {}),
        },
        body: JSON.stringify({ name, description, locked }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Misslyckades att skapa kanalen.");
        return;
      }

      setMessage("Kanal skapad!");
      setTimeout(() => navigate("/channels"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Något gick fel.");
    }
  }

  return (
    <div className="create-channel-page">
      <div className="create-channel-container">
        <button className="back-link" onClick={() => navigate(-1)}>
          Tillbaka
        </button>

        <h1 className="title">Skapa kanal</h1>

        <form className="form" onSubmit={handleCreate}>
          <input
            className="input"
            type="text"
            placeholder="Kanalnamn"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="input"
            type="text"
            placeholder="Beskrivning"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="visibility-section">
            <p className="visibility-label">Synlighet:</p>

            <label className="radio-option">
              <input
                type="radio"
                name="visibility"
                checked={!locked}
                onChange={() => setLocked(false)}
              />
              Öppen till alla
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="visibility"
                checked={locked}
                onChange={() => setLocked(true)}
              />
              Låst (inloggning krävs)
            </label>
          </div>

          <div className="buttons">
            <button
              type="button"
              className="btn cancel-btn"
              onClick={() => navigate(-1)}>
              Avbryt
            </button>

            <button type="submit" className="create-btn">
              Skapa kanal
            </button>
          </div>

          {message && <p className="status-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateChannel;
