// SOCKET.IO
let socket = io.connect();



const initSocket = async () => {
  socket.emit("auth", {
    userId: localStorage.getItem("userId"),
    token: localStorage.getItem("token")
  });
};

socket.on("auth", p => {
  app.socketReady = true;
  socket.emit("account", {});
});

socket.on("account", p => {
  console.log(p);
  
  app.account = p;
  stateChange();
});
