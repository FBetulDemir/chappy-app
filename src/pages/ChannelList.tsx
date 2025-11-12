import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

type Channel = {
  PK: string;
  SK: string;
  channelId: string;
  name: string;
  locked?: boolean;
  ownerId?: string;
  ownerName?: string;
};

export default function ChannelList() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  async function load() {
    setStatus("");
    const res = await fetch("/api/channels");
    if (!res.ok) {
      setStatus("Kunde inte hämta kanaler.");
      return;
    }
    const data: Channel[] = await res.json();
    const cleaned = (data || [])
      .filter((c) => c.SK === "META")
      .map((c) => ({
        PK: c.PK,
        SK: c.SK,
        channelId: c.channelId,
        name: c.name,
        locked: !!c.locked,
        ownerId: c.ownerId,
        ownerName: (c as any).ownerName,
      }));
    setChannels(cleaned);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(channelId: string) {
    setBusyId(channelId);
    setStatus("");
    try {
      const res = await fetch(`/api/channels/delete/${channelId}`, {
        method: "DELETE",
        headers: token ? { Authorization: "Bearer " + token } : {},
      });

      if (res.status === 204) {
        setChannels((prev) => prev.filter((c) => c.channelId !== channelId));
        setConfirmId(null);
        return;
      }
      if (res.status === 401) {
        setStatus("Du måste vara inloggad.");
        navigate("/login");
        return;
      }
      if (res.status === 403) {
        setStatus("Endast ägaren kan radera denna kanal.");
        return;
      }
      if (res.status === 404) {
        setStatus("Kanalen hittades inte.");
        return;
      }
      const data = await res.json().catch(() => ({} as any));
      setStatus(data.error || "Det gick inte att radera kanalen.");
    } catch {
      setStatus("Nätverksfel vid radering.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="channel-list-page">
      <div className="channel-list-header">
        <h1>Alla kanaler</h1>
        <Link to="/createChannel" className="btn btn-primary">
          Skapa kanal
        </Link>
      </div>

      {status && <div className="inline-status">{status}</div>}

      <div className="channel-list-table">
        <div className="row head">
          <div>Namn</div>
          <div>Synlighet</div>
          <div>Ägare</div>
          <div>Åtgärder</div>
        </div>

        {channels.map((c) => (
          <div key={c.channelId} className="row">
            <div>
              <Link to={`/channels/${c.channelId}`}># {c.name}</Link>
            </div>
            <div>{c.locked ? "Låst" : "Öppen"}</div>

            <div title={c.ownerName || c.ownerId || ""}>
              {c.ownerName || c.ownerId || "—"}
            </div>

            <div className="actions">
              {confirmId === c.channelId ? (
                <>
                  <button
                    className="btn btn-plain"
                    onClick={() => setConfirmId(null)}
                    disabled={busyId === c.channelId}>
                    Avbryt
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(c.channelId)}
                    disabled={busyId === c.channelId}>
                    {busyId === c.channelId ? "Raderar…" : "Bekräfta radering"}
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-danger"
                  onClick={() => setConfirmId(c.channelId)}>
                  Radera
                </button>
              )}
            </div>
          </div>
        ))}

        {channels.length === 0 && (
          <div className="row">
            <div className="empty">Inga kanaler hittades.</div>
          </div>
        )}
      </div>
    </div>
  );
}
