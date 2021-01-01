const crypto = require("crypto");
const shortId = require("../lib/shortId.js");

module.exports = async (appData, socket, path, p) => {
  if (path === "default") {
    const user = await appData.db.findOne({ id: socket.userId });

    const defaultRoomEntry = user.rooms.filter((r) => r.personal)[0];

    let roomId = crypto.randomBytes(16).toString("hex");
    if (!defaultRoomEntry) {
      console.log("creating room");

      await appData.roomsDb.insert({
        id: roomId,
        roomCode: shortId.generate(),
        name: `${user.name}'s Room`,
        members: [
          {
            id: socket.userId,
            role: "owner",
          },
        ],
        permissions: {
          join: "anyone",
          speak: "member",
          hear: "member",
          suggestVideo: "member",
          controlVideo: "moderator",
          selectVideo: "moderator",
          kick: "moderator",
          ban: "owner",
          manage: "owner",
        },
        public: false,
        personal: true,
      });

      await appData.db.update(
        { id: socket.userId },
        {
          $push: {
            rooms: {
              id: roomId,
              personal: true,
            },
          },
        }
      );
    } else {
      roomId = defaultRoomEntry.id;
    }

    // join
    console.log("join default room");
    await joinRoom(appData, socket, roomId);
  } else if (path === "leave") {
    if (socket.room) {
      leaveRoom(appData, socket);
    }
  } else if (path === "info") {
    const roomId = p.id ?? socket.room;
    if (!roomId) return;

    console.log("room info", roomId);
  }

  console.log(appData.rooms);
};

const joinRoom = async (appData, socket, roomId) => {
  const room = await appData.roomsDb.findOne({ id: roomId });
  if (!room) return;
  console.log("join", socket.userId, roomId);

  if (room.permissions.join !== "anyone") {
    let member = room.members.filter((m) => m.id === socket.id);
    console.log(member);
  }

  // leave old room
  if (socket.room) {
    await leaveRoom(appData, socket);
  }

  // spin up room
  if (!appData.rooms[roomId]) {
    appData.rooms[roomId] = {
      inRoom: [],
    };
  }

  // join
  socket.room = roomId;
  socket.join(roomId);
  appData.rooms[socket.room].inRoom.push({ id: socket.userId });

  // emit events
  appData.io.in(roomId).emit("room.join", {
    user: socket.userId,
    inRoom: appData.rooms[roomId].inRoom,
  });

  /*
  {
    id: "",
    role: "member/moderator/owner",
  },
  */
};

const leaveRoom = async (appData, socket) => {
  console.log("leave", socket.userId, socket.room);
  appData.rooms[socket.room] = {
    inRoom: appData.rooms[socket.room].inRoom.filter(
      (m) => m.id !== socket.userId
    ),
  };
  appData.io.in(socket.room).emit("room.leave", {
    user: socket.userId,
    inRoom: appData.rooms[socket.room].inRoom,
  });
  socket.leave(socket.room);

  if (appData.rooms[socket.room].inRoom.length === 0) {
    delete appData.rooms[socket.room];
  }

  delete socket.room;
};

const getPermLevel = (level) => {
  if (level === "owner") {
    return 3;
  } else if (level === "moderator") {
    return 2;
  } else if (level === "member") {
    return 1;
  } else if (level === "anyone") {
    return 0;
  }
  throw "unknow perm level";
};
