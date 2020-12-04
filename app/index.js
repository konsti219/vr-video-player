// -----------------------------
// Aframe Youtube Player Backend
// -----------------------------

// loading diffrent components
const initDatabase = require("./database.js");
const initWebserver = require("./web/webserver.js");
const initSocketserver = require("./socketserver.js");

// object that is passed to each component to facilitate state exchange
let app = {};

(async () => {
  app.db = await initDatabase(".data/users.db");
  app.server = await initWebserver(app);
  app.io = await initSocketserver(app);
})();
