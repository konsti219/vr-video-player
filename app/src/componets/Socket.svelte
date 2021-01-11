<!-- Logic Component -->
<script>
  export let app;

  let disconnectTimer = window.setTimeout(() => location.reload(), 10000);

  app.socket.on("connect", () => {
    console.log("socket connected");
    window.clearTimeout(disconnectTimer);
  });

  app.socket.on("disconnect", () => {
    console.log("socket disconnected");
    disconnectTimer = window.setTimeout(() => location.reload(), 10000);
  });
</script>


