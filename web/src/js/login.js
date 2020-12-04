// SOCKET.IO
let socket = io.connect();

// check login
(async () => {
  // check if token present
  if (localStorage.getItem("userId") && localStorage.getItem("token")) {
    // present, validate
    console.log("checking token");
    const data = await (await fetch(
      `/api/auth/token/validate?userId=${localStorage.getItem(
        "userId"
      )}&token=${localStorage.getItem("token")}`
    )).json();
    app.loggedIn = data.valid;
  }
  if (!app.loggedIn) {
    // not present, remove
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
  }

  stateChange();
})();

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
