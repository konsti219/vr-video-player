// EXPRESS WEBSERVER
const staticFiles = "../web/public/";

// LIBS
const express = require("express");
const useragent = require("express-useragent");
const path = require("path");

const initWebserver = async appData => {
  const app = express();
  app.use(useragent.express());
  app.use(express.json());

  const server = app.listen(process.env.PORT, () => {
    console.log("listening on port " + server.address().port);
  });

  // ROUTES (in a prod env static content will be served by nginx)
  // home
  if (process.env.NODE_ENV == "development") {
    app.get("/", async (req, res) => {
      res.status(200);
      res.sendFile(path.join(__dirname, staticFiles, "index.html"));
    });

    // static
    app.use(express.static(path.join(__dirname, staticFiles)));
  }

  // api
  const apiRouter = require("./routes/api");
  app.use("/api", apiRouter(appData));
  
  return server;
};

module.exports = initWebserver;
