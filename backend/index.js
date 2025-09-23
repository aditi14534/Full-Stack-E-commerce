const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db");
const router = require("./routes");

const app = express();

// ✅ Simple and reliable CORS setup
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Body parsers & cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api", router);

// ✅ Server start
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Connected to DB");
    console.log("Server running on port " + PORT);
    console.log("Allowed origin:", process.env.FRONTEND_URL);
  });
});
