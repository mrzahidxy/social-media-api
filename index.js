const express = require("express");
const mongoose = require("mongoose");

const authRouter = require("./routes/auth");
const conversationRouter = require("./routes/conversation");
const messageRouter = require("./routes/message");
const userRouter = require("./routes/users");

const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

//*---------DATABASE-CONNECTED----------
mongoose
  .connect(
    "mongodb+srv://mrzahidxy:mrzahidxy10@social-media-app.lvndutj.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Database Is Connetced!"))
  .catch((error) => console.log(error));

//*----------ROUTES--------------
app.use("/api/auth", authRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/message", messageRouter);
app.use("/api/users", userRouter);

//*----------APP RUNNING------------
app.listen(8080, () => {
  console.log("Backened Server Is Running!");
});

const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

//when connect
io.on("connection", (socket) => {
  //when disconnect
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //when disconnect
  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});
