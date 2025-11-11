import { Outlet } from "react-router";
import "../styles/channels.css";
import SideBarChannels from "../components/SideBarChannels";
import TopNav from "../components/TopNav";

const Channels = () => {
  return (
    <div className="channels-wrapper">
      <div className="left-side">
        <SideBarChannels />
      </div>
      <div className="right-side">
        <header>
          <TopNav />
        </header>
        <main className="right-side content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Channels;
