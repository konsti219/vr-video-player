// WEBSOCKET SERVER

// LIBS
const socketio = require("socket.io");
const youtubeApi = require("./lib/youtube-api.js");

const sendAccount = async (socket, appData) => {
  const user = await appData.db.findOne({ id: socket.userId });

  if (user) {
    socket.emit("account.info", {
      id: user.id,
      name: user.name,
      friendCode: user.friendCode,
    });
  }
};

const initSocketserver = async (appData) => {
  const io = socketio(appData.server, {
    pingInterval: 10000,
  });

  io.on("connection", (socket) => {
    /*socket.on("videos", async p => {
      try {
        let videos = await youtubeApi.getVideos(p.region, p.category);
        socket.emit("videos", { videos });

        //console.log("sending", videos[0]);
      } catch (e) {}
    });*/

    socket.on("auth", async (p) => {
      let valid = true;
      const users = await appData.db.find({ id: p.userId });
      if (users.length !== 1) valid = false;
      else {
        valid = users[0].token === p.token;
      }

      if (valid) socket.userId = p.userId;
      socket.emit("auth", { valid });
    });

    socket.on("account.info", async (p) => {
      await sendAccount(socket, appData);
    });

    socket.on("account.changename", async (p) => {
      await appData.db.update(
        { id: socket.userId },
        { $set: { name: p.name } }
      );

      await sendAccount(socket, appData);
    });
  });

  return io;
};

module.exports = initSocketserver;
