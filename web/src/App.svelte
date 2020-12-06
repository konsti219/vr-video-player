<script>
  import Scene from "./componets/Scene.svelte";
  import Interface from "./componets/Interface.svelte";
  import Socket from "./componets/Socket.svelte";

  import io from "socket.io-client/dist/socket.io.min.js";

  let app = {};
  app.socket = io();

  app.account = {};
  let inGame = false;
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
  <Interface {app} bind:inGame />
  <Scene {app} bind:inGame />
  <Socket {app} />
</main>
