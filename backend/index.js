// Spring Time
const http = require("http");
const express = require("express");
const connection = require("./database/connection");
const userRouter = require("./routes/users");
const houseRouter = require("./routes/house");
const User = require("./models/users");
const House = require("./models/house");
const HouseImages = require("./models/houseImages");
const cors = require("cors");
const { initIo } = require("./socket");

const app = express();
const httpServer = http.createServer(app);
const io = initIo(httpServer);

app.use(cors());
app.use(express.static("uploads"));
app.use(express.json());
app.use(userRouter);
app.use(houseRouter);

// Error Handler
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message });
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

const start = async () => {
  try {
    await connection.authenticate();
    await User.sync();
    await House.sync();
    await HouseImages.sync();
    console.log("Connection has been established successfully.");
    httpServer.listen(3333);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

House.hasMany(HouseImages, {
  onDelete: "CASCADE",
});
HouseImages.belongsTo(House);

start();
