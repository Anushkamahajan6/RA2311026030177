require("dotenv").config();
const express = require("express");
const Log = require("./logging_middleware/logger");

const app = express();
app.use(express.json());

const PORT = 3000;

// 🔥 GLOBAL LOGGING MIDDLEWARE
app.use(async (req, res, next) => {
  await Log(
    "backend",
    "info",
    "route",
    `${req.method} ${req.url}`,
    process.env.ACCESS_TOKEN
  );
  next();
});

// ✅ TEST ROUTE
app.get("/", async (req, res) => {
  await Log(
    "backend",
    "info",
    "controller",
    "Home route hit",
    process.env.ACCESS_TOKEN
  );

  res.send("Server is running 🚀");
});

// ❌ ERROR SIMULATION ROUTE (important for testing)
app.get("/error", async (req, res) => {
  await Log(
    "backend",
    "error",
    "handler",
    "Test error occurred",
    process.env.ACCESS_TOKEN
  );

  res.status(500).send("Error simulated");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});