const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./db/db");
const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");

connectDB();


app.use(cors());

// Use Express built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/users", userRoutes);

app.use("/chatbot",chatRoutes);


module.exports = app;