// const axios = require("axios");

// const LOG_API = "http://20.207.122.201/evaluation-service/logs";

// // Allowed values
// const validStacks = ["backend"];
// const validLevels = ["debug", "info", "warn", "error", "fatal"];
// const validPackages = [
//   "cache",
//   "controller",
//   "cron_job",
//   "db",
//   "domain",
//   "handler",
//   "repository",
//   "route",
//   "service"
// ];

// async function Log(stack, level, pkg, message, token) {
//   try {
//     // validation (important)
//     if (!validStacks.includes(stack)) return;
//     if (!validLevels.includes(level)) return;
//     if (!validPackages.includes(pkg)) return;

//     await axios.post(
//       LOG_API,
//       {
//         stack,
//         level,
//         package: pkg,
//         message
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );
//   } catch (err) {
//     // silently fail (DO NOT use console.log)
//   }
// }

// module.exports = Log;


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