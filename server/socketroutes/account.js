const sendAccount = async (socket, appData) => {
  const user = await appData.db.findOne({ id: socket.userId });

  socket.emit("account.info", {
    id: user.id,
    name: user.name,
    friendCode: user.friendCode,
    rooms: user.rooms,
    friends: user.friends,
  });
};

module.exports = async (appData, socket, path, p) => {
  if (path === "info") {
    await sendAccount(socket, appData);
  } else if (path === "changename") {
    await appData.db.update({ id: socket.userId }, { $set: { name: p.name } });
    await sendAccount(socket, appData);
  }
};
