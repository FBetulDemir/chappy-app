import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Channels from "./pages/Channels";
import ChannelMessages from "./components/ChannelMessages";

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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
