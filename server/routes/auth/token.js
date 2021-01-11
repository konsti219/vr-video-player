// LIBS
const express = require("express");
const router = express.Router();

module.exports = appData => {
  router.appData = appData;

  // -----------------------
  // AUTH - Token
  // -----------------------

  // vaidate your current token
  router.get("/validate", async (req, res) => {
    let valid = true;

    if (!req.query.userId || !req.query.token) {
      res.status(400);
      res.end();
      return;
    }

    const users = await router.appData.db.find({ id: req.query.userId });
    if (users.length !== 1) valid = false;
    else {
      valid = users[0].token === req.query.token;
    }

    res.status(200);
    res.json({
      id: req.query.userId,
      valid
    });
  });

  // remove a token (device)
  /*router.post("/remove", async (req, res) => {
    let auth = await validateRequest(req, res, router.db.usersDb);
    console.log("token remove");
  });
*/
  return router;
};
