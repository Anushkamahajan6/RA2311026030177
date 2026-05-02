require("dotenv").config();
const express = require("express");
const axios = require("axios");
const buildSchedule = require("./vehicle_maintenance_scheduler/scheduler");
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
    process.env.ACCESS_TOKEN,
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
    process.env.ACCESS_TOKEN,
  );

  res.send("Server is running 🚀");
});

app.get("/schedule", async (req, res) => {
  try {
    console.log("🔥 Schedule route hit");
    await Log(
      "backend",
      "info",
      "service",
      "Scheduler started",
      process.env.ACCESS_TOKEN,
    );

    // fetch depots
    const depotResponse = await axios.get(
      "http://20.207.122.201/evaluation-service/depots",
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      },
    );

    const vehicleResponse = await axios.get(
      "http://20.207.122.201/evaluation-service/vehicles",
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      },
    );

    console.log("Depots:", depotResponse.data);
    console.log("Vehicles:", vehicleResponse.data);
    const depots = depotResponse.data.depots;
const vehicles = vehicleResponse.data.vehicles;

const maxHours = depots?.[0]?.MechanicHours || 50;

const scheduleResult = buildSchedule(vehicles, maxHours);


    await Log(
      "backend",
      "info",
      "controller",
      "Schedule generated",
      process.env.ACCESS_TOKEN,
    );

    res.json({
      success: true,
      data: scheduleResult,
    });
  } catch (error) {
    console.log("❌ FULL ERROR:", error); // add this
    console.log("❌ MESSAGE:", error.message);
    await Log(
      "backend",
      "error",
      "controller",
      "Scheduler failed",
      process.env.ACCESS_TOKEN,
    );
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ❌ ERROR SIMULATION ROUTE (important for testing)
app.get("/error", async (req, res) => {
  await Log(
    "backend",
    "error",
    "handler",
    "Test error occurred",
    process.env.ACCESS_TOKEN,
  );

  res.status(500).send("Error simulated");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
