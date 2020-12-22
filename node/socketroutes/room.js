const crypto = require("crypto");

module.exports = async (appData, socket, path, p) => {
  if (path === "default") {
    const user = await appData.db.findOne({ id: socket.userId });

    const defaultRoom = user.roomsOwned.filter((r) => r.personal)[0];
    if (!defaultRoom) {
      console.log("creating room");

      await appData.db.update(
        { id: socket.userId },
        {
          $push: {
            roomsOwned: {
              id: crypto.randomBytes(16).toString("hex"),
              name: `${user.name}'s Room`,
              members: [],
              permisssions: {
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
            },
          },
        }
      );
    }

    // join
    console.log("join default room");
    joinRoom(appData, socket, socket.userId, defaultRoom.id);
  } else if (path === "") {
    //
  }

  console.log(appData.rooms);
};

const joinRoom = async (appData, socket, ownerId, roomId) => {
  const owner = await appData.db.findOne({ id: ownerId });
  if (!owner) return;
  const room = owner.roomsOwned.filter((r) => r.id === roomId);
  if (!room) return;

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
  appData.rooms[socket.room].inRoom.push(socket.userId);

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
  if (socket.room) {
    appData.rooms[socket.room].inRoom = appData.rooms[
      socket.room
    ].inRoom.filter((m) => m.id !== socket.userId);
    appData.io.in(roomId).emit("room.leave", {
      user: socket.userId,
      inRoom: appData.rooms[roomId].inRoom,
    });
    socket.leave(socket.room);

    if (appData.rooms[socket.room].inRoom.length === 0) {
      appData.rooms[socket.room] = null;
    }

    socket.room = undefined;
  }
};
