// -----------------------------
// Aframe Youtube Player Backend
// -----------------------------

require("dotenv").config({ path: "../.env" });
console.log(`vr-video-player running in ${process.env.NODE_ENV} envoirment`);

// loading diffrent components
const initDatabase = require("./database.js");
const initWebserver = require("./webserver.js");
const initSocketserver = require("./socketserver.js");

// object that is passed to each component to facilitate state exchange
let app;

(async () => {
  app = await initDatabase(".data/users.db", "./.data/rooms.db");
  app.server = await initWebserver(app);
  app.io = await initSocketserver(app);
})();
