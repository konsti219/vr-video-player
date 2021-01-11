// LIBS
const express = require("express");
const router = express.Router();

const googleRouter = require("./google.js");
const tokenRouter = require("./token.js");

module.exports = appData => {
  router.appData = appData;

  // -----------------------
  // Auth Routes
  // -----------------------

  router.use("/google", googleRouter(router.appData));
  router.use("/token", tokenRouter(router.appData));

  return router;
};
