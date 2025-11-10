import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Channels from "./pages/Channels";
import ChannelMessages from "./components/ChannelMessages";
import AllUsers from "./components/AllUsers";
import DirectMessages from "./components/DirectMessages";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/channels" element={<Channels />}>
            <Route path=":channelId" element={<ChannelMessages />} />
          </Route>
          <Route path="/users" element={<AllUsers />} />
          <Route path="/dm/:withUserId" element={<DirectMessages />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
