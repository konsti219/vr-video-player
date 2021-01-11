// WEBSOCKET SERVER

// LIBS
const socketio = require("socket.io");
const youtubeApi = require("./lib/youtube-api.js");

const authRouter = async (appData, socket, path, p) => {
  if (path === "login") {
    let valid = true;
    const user = await appData.db.findOne({ id: p.userId });
    if (!user) valid = false;
    else {
      valid = user.token === p.token;
    }

    if (valid) socket.userId = p.userId;
    socket.emit("auth.login", { valid });
  }
};
const accountRouter = require("./socketroutes/account.js");
const roomRouter = require("./socketroutes/room.js");

const initSocketserver = async (appData) => {
  const io = socketio(appData.server, {
    pingInterval: 10000,
  });
  appData.rooms = {};

  io.on("connection", (socket) => {
    /*socket.on("videos", async p => {
      try {
        let videos = await youtubeApi.getVideos(p.region, p.category);
        socket.emit("videos", { videos });

        //console.log("sending", videos[0]);
      } catch (e) {}
    });*/
    let socketRouters = {
      auth: {
        required: [],
        next: authRouter,
      },
    };
    socketRouters["account"] = {
      required: ["userId"],
      next: accountRouter,
    };
    socketRouters["room"] = {
      required: ["userId"],
      next: roomRouter,
    };

    socket.onAny(async (event, p) => {
      const path = event.split(".");
      if (path.length > 1) {
        const routerPath = path[0];
        const subPath = path.slice(1).join(".");

        const router = socketRouters[routerPath];
        if (
          router &&
          router.required.map((r) => !socket[r]).reduce((a, c) => a + c, 0) ===
            0
        ) {
          await router.next(appData, socket, subPath, p);
        }
      }
    });

    /*


    socket.on("room.default", async (p) => {});*/
  });

  return io;
};

module.exports = initSocketserver;
