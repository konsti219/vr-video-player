// EXPRESS WEBSERVER

// LIBS
const express = require("express");
const useragent = require("express-useragent");

const initWebserver = async appData => {
  const app = express();
  app.use(useragent.express());
  app.use(express.json());

  const server = app.listen(process.env.PORT, () => {
    console.log("listening on port " + server.address().port);
  });

  // ROUTES
  // home
  app.get("/", async (req, res) => {
    res.status(200);
    res.sendFile(__dirname + "/views/index.html");
  });

  // static
  app.use(express.static(__dirname + "/public"));

  // api
  const apiRouter = require("./routes/api");
  app.use("/api", apiRouter(appData));
  
  return server;
};

module.exports = initWebserver;
