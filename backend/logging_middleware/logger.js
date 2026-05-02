const axios = require("axios");

const LOG_API = "http://20.207.122.201/evaluation-service/logs";


const validStacks = ["backend"];
const validLevels = ["debug", "info", "warn", "error", "fatal"];
const validPackages = [
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service"
];
async function Log(stack, level, pkg, message, token) {
  try {
    const res = await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

  } catch (err) {
    // silently fail
  }
}

module.exports = Log;