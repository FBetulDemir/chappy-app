import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import "../styles/SideBarChannel.css";
import chatIcon from "../assets/carbon_chat-bot.png";

type Channel = { channelId: string; name: string; locked?: boolean };

const SideBarChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/channels");
      const data = await res.json();
      setChannels(
        (data || [])
          //  only channels
          .filter((channel: any) => channel.SK === "META")
          .map((channel: any) => ({
            channelId: channel.channelId,
            name: channel.name,
            locked: !!channel.locked,
          }))
      );
    })();
  }, []);
  return (
    <div className="side-bar">
      <div className="chat-icon">
        <img src={chatIcon} alt="" />
      </div>
      <div className="side-title">KANALER</div>
      <nav className="channel-list">
        {channels.map((ch) => (
          <NavLink
            key={ch.channelId}
            to={`/channels/${ch.channelId}`}
            className={({ isActive }) =>
              "channel-link" + (isActive ? " active" : "")
            }
            title={ch.locked ? "Låst kanal" : "Öppen kanal"}>
            <span>#{ch.name}</span>
            {ch.locked && <span className="lock">🔒</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default SideBarChannels;
