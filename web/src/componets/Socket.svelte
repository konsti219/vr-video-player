<script>
  export let app;
  let socket = app.socket;
  let account = app.account;

  socket.on("auth", (p) => {
    socket.emit("account", {});
  });

  socket.on("account", (p) => {
    console.log(p);

    account = p;
  });
</script>

<div style="display: none;">
  <!-- Just a place for socket.io code -->
</div>
