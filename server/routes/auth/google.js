// LIBS
const express = require("express");
const router = express.Router();

const google = require("googleapis").google;
const fetch = require("node-fetch");
const crypto = require("crypto");
const shortId = require("../../lib/shortId");

const prod = process.env.NODE_ENV == "production";

// GOOGLE AUTH SETUP
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://" + process.env.DOMAIN + "/api/auth/google/callback"
);
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://www.googleapis.com/auth/userinfo.email"],
});

module.exports = (appData) => {
  router.appData = appData;

  // -----------------------
  // AUTH - Google
  // -----------------------

  // url redirect to google login
  router.get("/", async (req, res) => {
    if (prod) {
      res.redirect(authUrl);
    } else {
      res.redirect(
        "//" +
          req.headers.host +
          "/api/auth/google/callback?code=1234" +
          (req.query.user ? "&user=" + req.query.user : "")
      );
    }
  });

  // after login with google
  router.get("/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) {
      res.status(400);
      res.json({ message: "no code", status: 400 });
      return;
    }

    let data = {};
    if (prod) {
      // prod
      // Get an access token based on the OAuth code
      let tokens;
      try {
        tokens = (await oAuth2Client.getToken(code)).tokens;
      } catch (e) {
        res.status(401);
        res.json({ message: "wrong code", status: 401 });
        return;
      }

      // request userinfo (id + email + profile pic)
      const resData = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        }
      );
      data = await resData.json();
    } else {
      // dev
      if (req.query.code == "1234") {
        data = {
          id: req.query.user ?? process.env.TEST_USER_ID,
          email: `${req.query.user ?? process.env.TEST_USER_ID}@example.com`,
          picture: "---",
        };
      } else {
        res.status(401);
        res.json({ message: "wrong code", status: 401 });
        return;
      }
    }

    // generate token
    const token = crypto.randomBytes(32).toString("hex");

    // generate it
    let id = crypto.randomBytes(16).toString("hex");

    // check db if user is new
    if ((await router.appData.db.find({ googleId: data.id })).length === 0) {
      // new user
      console.log(
        `new user, id:${id}, googleid:${data.id}, email:${data.email}`
      );
      await router.appData.db.insert({
        id,
        googleId: data.id,
        email: data.email,
        picture: data.picture,
        token,
        friendCode: shortId.generate(),
        name: "[NEW]",
        rooms: [],
        friends: [],
      });
    } else {
      // old user
      console.log(`old user, googleid:${data.id}, email:${data.email}`);
      await router.appData.db.update(
        { googleId: data.id },
        {
          $set: { token },
        }
      );

      id = (await router.appData.db.find({ googleId: data.id }))[0].id;
    }

    // set cookies (will be moved to localstorage by client)
    res.cookie("userId", id, {
      secure: prod,
      sameSite: true,
    });
    res.cookie("userToken", token, {
      secure: prod,
      sameSite: true,
    });

    res.redirect("//" + req.headers.host);
  });

  return router;
};
