<script>
  import { onMount, onDestroy } from "svelte";

  import VrVideo from "./VrVideo.svelte";
  import VideoPicker from "./VideoPicker.svelte";

  export let keyboardActive;
  export let handleKeyboard;
  export let socket;
  export let account;

  let videoId;

  let vrVideo;
  let activeRoom;
  let inRoom;

  onMount(() => {
    socket.on("videos", (p) => {
      console.log(p);
    });

    socket.emit("room.default", {});
    socket.on("room.join", (p) => {
      console.log("room join", p);

      if (p.user === account.id) {
        console.log("self join");

        socket.emit("room.info", {});
      }
    });
    socket.on("room.leave", (p) => {
      console.log("room leave", p);

      if (p.user === account.id) {
        console.log("self leave");
        activeRoom = undefined;
        inRoom = undefined;
      }
    });

    socket.on("room.info", (p) => {
      console.log("room info", p);
    });
  });

  onDestroy(() => {
    socket.removeAllListeners("videos");
    socket.removeAllListeners("room.join");
    socket.removeAllListeners("room.leave");

    socket.emit("room.leave", {});
    activeRoom = undefined;
    inRoom = undefined;
  });
</script>

<VrVideo bind:this={vrVideo} bind:videoId autoplay={true} position="0 1.7 -2" />

<VideoPicker
  position="1.8 1.5 -2"
  bind:keyboardActive
  bind:handleKeyboard
  on:pick={(e) => {
    videoId = e.detail.pick;
  }} />

<!-- 
  TODO:
  - show room info
  - show room members / online
  - allow room joining
  - check room permissions
-->

<!-- RECOMMENDATIONS 
    <a-entity position="2 4.1 -1" id="watchList" rotation="0 -45 0">
    </a-entity>

    <a-image
      id="browseUp"
      class="collidable"
      position="1.25 1.9 -1.5"
      scale="0.5 0.5" />
    <a-image
      id="browseDown"
      class="collidable"
      position="1.25 1.3 -1.5"
      scale="0.5 0.5" />-->
