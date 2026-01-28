import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import "../styles/channelList.css";

type Channel = {
  PK: string;
  SK: string;
  channelId: string;
  name: string;
  locked?: boolean;
  ownerId?: string;
  ownerName?: string;
};

const ChannelList = () => {
  const [channels, setChannels] = useState<Channel[]>([]);

  //store which channel is currently being deleted (used to disable its buttons).
  const [busyId, setBusyId] = useState<string | null>(null);
  //it asks for confirmation before deleting a channel
  //Stores the id of the channel that delete button is clicked (to show confirmation).
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  // current logged in user id (decoded from JWT)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  const decodeJwtUserId = (token: string | null) => {
    try {
      return token ? JSON.parse(atob(token.split(".")[1])).userId : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const userid = decodeJwtUserId(token);
    setCurrentUserId(userid);
  }, [token]);

  //loading channels from backend
  async function load() {
    setStatus("");
    const res = await fetch("/api/channels");
    if (!res.ok) {
      setStatus("Kunde inte hämta kanaler.");
      return;
    }
    const data: Channel[] = await res.json();
    setChannels(data);
  }

  useEffect(() => {
    load();
  }, []);

  //delete channel function
  //from backend with endpoint /api/channels/delete/:channelId
  async function handleDelete(channelId: string) {
    setBusyId(channelId); //disables the delete buttons
    setStatus("");

    //Sends a DELETE request to backend with the user’s JWT
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
      //to fix
      //this does not work fix it!!!
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
        <Link to="/createChannel" className="btn btn-primary">
          Skapa kanal
        </Link>
        <Link to="/channels" className="btn btn-secondary">
          Tillbaka
        </Link>
      </div>

      {/* this is to show if something goes wrong */}
      {status && <div className="inline-status">{status}</div>}

      <div className="channel-list-table">
        <h1 className="title-channels">Alla kanaler</h1>
        {/* <div className="row head">
          <div>Namn </div>
          <div>Synlighet</div>

          <div>Åtgärder</div>
        </div> */}

        {channels.map((c) => {
          const isOwner = !!c.ownerId && currentUserId === c.ownerId;
          return (
            <div key={c.channelId} className="row">
              <div>
                <Link to={`/channels/${c.channelId}`}># {c.name}</Link>
              </div>
              <div>Synlighet: {c.locked ? "Låst" : "Öppen"}</div>
              {/* <div>Ägare {c.ownerName || c.ownerId}</div> */}
              <div className="owner-info">
                {isOwner
                  ? "Det är din kanal — du kan ta bort den."
                  : "Det är inte din kanal — du kan inte ta bort den."}
              </div>

              <div className="actions">
                {confirmId === c.channelId ? (
                  <>
                    <button
                      className="btn btn-confirm"
                      onClick={() => setConfirmId(null)}
                      disabled={busyId === c.channelId}>
                      Avbryt
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(c.channelId)}
                      disabled={busyId === c.channelId || !isOwner}
                      title={
                        !isOwner
                          ? "Endast ägaren kan radera denna kanal."
                          : undefined
                      }>
                      {busyId === c.channelId
                        ? "Raderar…"
                        : "Bekräfta radering"}
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-danger"
                    onClick={() => isOwner && setConfirmId(c.channelId)}
                    disabled={!isOwner}
                    title={
                      !isOwner
                        ? "Endast ägaren kan radera denna kanal."
                        : undefined
                    }>
                    Radera
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {channels.length === 0 && (
          <div className="row">
            <div className="empty">Inga kanaler hittades.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelList;
