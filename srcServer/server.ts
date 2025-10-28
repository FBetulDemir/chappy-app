import express from "express";
import usersRouter from "./routes/users/users.js";
import { logger } from "./middleware.js";
import channelRouter from "./routes/channels/channels.js";
import registerUserRouter from "./routes/users/registerUser.js";
import loginRouter from "./routes/users/login.js";
import deleteRouter from "./routes/users/deleteUser.js";

const app = express();
const port: number = Number(process.env.PORT) || 1337;

app.use(express.static("./dist/"));
app.use(express.json());
app.use("/", logger);

app.use("/api/users", usersRouter);
app.use("/api/channels", channelRouter);
app.use("/api/registerUser", registerUserRouter);
app.use("/api/login", loginRouter);
app.use("/api/delete", deleteRouter);

app.listen(port, (error) => {
  if (error) {
    console.log("Server could not start! ", error.message);
  } else {
    console.log(`Server is listening on port ${port}...`);
  }
});
