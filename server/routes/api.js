// LIBS
const express = require("express");
const router = express.Router();

const authRouter = require("./auth/auth.js");

module.exports = (appData) => {
  router.appData = appData;

  // -----------------------
  // Api Routes
  // -----------------------

  router.get("/", (req, res) => {
    res.status(200);
    res.json({
      code: 200,
      status: "OK",
    });
  });

  router.use("/auth", authRouter(router.appData));

  return router;
};
