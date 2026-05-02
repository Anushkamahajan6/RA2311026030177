require("dotenv").config();
const Log = require("./logging_middleware/logger");

async function test() {
  await Log(
    "backend",
    "info",
    "route",
    "test log from my app",
    process.env.ACCESS_TOKEN
  );

  console.log("Log sent (if no error)");
}

test();