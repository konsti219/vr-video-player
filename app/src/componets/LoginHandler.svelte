<!-- Logic Component -->
<script>
  export let account;
  export let socket;
  export let loggedIn;

  // transfer cookie to local storage, because setting cookies on server is easier
  const getCookie = (cookie) => {
    const val = document.cookie
      .split("; ")
      .find((row) => row.split("=")[0] === cookie);
    return val ? val.split("=")[1] : val;
  };
  if (getCookie("userId")) {
    localStorage.setItem("userId", getCookie("userId"));
    localStorage.setItem("token", getCookie("userToken"));
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }

  // check login
  (async () => {
    // check if token present
    if (localStorage.getItem("userId") && localStorage.getItem("token")) {
      // present, validate
      console.log("token check");
      const data = await (
        await fetch(
          `/api/auth/token/validate?userId=${localStorage.getItem(
            "userId"
          )}&token=${localStorage.getItem("token")}`
        )
      ).json();
      loggedIn = data.valid;

      console.log("token valid", loggedIn);
    }
    if (!loggedIn) {
      // not present, remove
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
    } else {
      // start socket
      // this may cause the auth.login to be sent multiple if the socket connects after this runs.
      // But it is needed to ensure that if it reconnects it is reauthenticated.
      // Also sending it multiple times won't cause issues
      socketLogin();
      socket.on("connect", socketLogin);
    }
  })();
  const socketLogin = () => {
    socket.emit("auth.login", {
      userId: localStorage.getItem("userId"),
      token: localStorage.getItem("token"),
    });
  };

  socket.on("auth.login", (p) => {
    socket.emit("account.info", {});
  });
  socket.on("account.info", (p) => {
    console.log(p);
    account = p;
  });
</script>


