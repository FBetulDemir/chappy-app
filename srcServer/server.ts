import express from "express";
import cors from "cors";
import usersRouter from "./routes/users/users.js";
import { logger } from "./middleware.js";
import channelRouter from "./routes/channels/channels.js";
import registerUserRouter from "./routes/users/registerUser.js";
import loginRouter from "./routes/users/login.js";
import deleteRouter from "./routes/users/deleteUser.js";
import createChannelRouter from "./routes/channels/createChannel.js";
import deleteChannelRouter from "./routes/channels/deleteChannel.js";
import messageRouter from "./routes/messages/channelMessage.js";
import allMessagesRouter from "./routes/messages/messages.js";
import dmGetRouter from "./routes/messages/messages.js";
import dmPostRouter from "./routes/messages/sendDm.js";

const app = express();
const port: number = Number(process.env.PORT) || 1337;

// const FRONTEND = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
// app.use(cors({ origin: [FRONTEND, "http://localhost:5173"] }));

import path from "path";
app.use(express.static(path.resolve("dist")));

// app.use(express.static("./dist/"));
app.use(express.json());
app.use("/", logger);

//endpoints for user
app.use("/api/users", usersRouter);

app.use("/api/registerUser", registerUserRouter);
app.use("/api/login", loginRouter);
app.use("/api/delete", deleteRouter);

//endpoints for channel
app.use("/api/channels/create", createChannelRouter);
app.use("/api/channels", channelRouter);
app.use("/api/channels/delete", deleteChannelRouter);

//endpoints for messages
app.use("/api/messages", messageRouter);
app.use("/api/messages", allMessagesRouter);
app.use("/api/messages", dmGetRouter);
app.use("/api/messages", dmPostRouter);

app.listen(port, (error) => {
  if (error) {
    console.log("Server could not start! ", error.message);
  } else {
    console.log(`Server is listening on port ${port}...`);
  }
});
