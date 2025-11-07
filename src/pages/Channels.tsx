import ChannelMessages from "../components/ChannelMessages";
import SideBarChannels from "../components/SideBarChannels";

const Channels = () => {
  return (
    <div className="channels-wrapper">
      <div className="left-side">
        <SideBarChannels />
      </div>
      <main className="right-side content">
        <ChannelMessages />
      </main>
    </div>
  );
};

export default Channels;
