// Spring Time
const express = require("express");
const connection = require("./database/connection");
const userRouter = require("./routes/users");
const houseRouter = require("./routes/house");
const User = require("./models/users");
const House = require("./models/house");
const HouseImages = require("./models/houseImages");
const cors = require("cors");

const app = express();

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

House.hasMany(HouseImages, {
  onDelete: "CASCADE",
});
HouseImages.belongsTo(House);

const start = async () => {
  try {
    await connection.authenticate();
    await User.sync();
    await House.sync();
    await HouseImages.sync();
    console.log("Connection has been established successfully.");
    app.listen(3333);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

start();
