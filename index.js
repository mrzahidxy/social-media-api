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

//?----------------------DATABASE-CONNECTED------------------
mongoose
  .connect(
    "mongodb+srv://mrzahidxy:mrzahidxy10@social-media-app.lvndutj.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Database Is Connetced!"))
  .catch((error) => console.log(error));

app.use(express.json());
app.use(cors());

//?---------------ROUTES-------------------
app.use("/api/auth", authRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/message", messageRouter);
app.use("/api/users", userRouter);

//?----------------APP RUNNING---------------
app.listen(8080, () => {
  console.log("Backened Server Is Running!");
});
