<script>
  export let app;
  export let account;
  let socket = app.socket;

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
    socket.emit("account.info", {});
  });

  socket.on("account.info", (p) => {
    console.log(p);
    account = p;
  });
</script>

<div style="display: none;">
  <!-- Just a place for socket.io code -->
</div>
