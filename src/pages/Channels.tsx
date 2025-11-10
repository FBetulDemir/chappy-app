import { Outlet } from "react-router";
import "../styles/channels.css";

import SideBarChannels from "../components/SideBarChannels";

const Channels = () => {
  return (
    <div className="channels-wrapper">
      <div className="left-side">
        <SideBarChannels />
      </div>
      <main className="right-side content">
        <Outlet />
      </main>
    </div>
  );
};

export default Channels;
