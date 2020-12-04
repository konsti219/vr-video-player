// LIBS
const express = require("express");
const router = express.Router();

const authRouter = require("./auth/auth.js");
const accountRouter = require("./account.js");
//const serverRouter = require("./servers.js")

module.exports = appData => {
  router.appData = appData;

  // -----------------------
  // Api Routes
  // -----------------------

  router.use("/auth", authRouter(router.appData));
  //router.use("/account", accountRouter(router.db));
  //router.use("/servers", serverRouter(router.db));

  return router;
};
