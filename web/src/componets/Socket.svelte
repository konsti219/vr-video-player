<script>
  export let app;
  let socket = app.socket;
  let account = app.account;

  let disconnectTimer = window.setTimeout(() => location.reload(), 10000);

  app.socket.on("connect", () => {
    console.log("socket connected");
    window.clearTimeout(disconnectTimer);
  });

  app.socket.on("disconnect", () => {
    console.log("socket disconnected");
    disconnectTimer = window.setTimeout(() => location.reload(), 10000);
  });

  socket.on("auth", (p) => {
    socket.emit("account", {});
  });

  socket.on("account", (p) => {
    console.log(p);

    app.account = p;
    app = app;
  });
</script>

<div style="display: none;">
  <!-- Just a place for socket.io code -->
</div>
