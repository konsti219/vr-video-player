<script>
  import Scene from "./componets/Scene.svelte";
  import Interface from "./componets/Interface.svelte";

  import io from "socket.io-client/dist/socket.io.min.js";

  let socket = io();
  socket.on("connect", () => console.log("socket connected"));
  console.log(socket);
</script>

<style>
  main {
    margin: 0;
    padding: 0;
    display: block;
    height: 100%;
    width: 100%;
    position: relative;
  }
</style>

<!-- CONTAINER -->
<main>
  <Scene {socket} />
  <Interface {socket} />
</main>
