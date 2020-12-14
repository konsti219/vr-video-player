<script>
  import VrVideo from "./VrVideo.svelte";
  import VideoPicker from "./VideoPicker.svelte";

  export let keyboardActive;
  export let handleKeyboard;
  export let socket;

  let videoId;

  socket.on("videos", (p) => {
    console.log(p);
  });

  let vrVideo;
</script>

<VrVideo bind:this={vrVideo} bind:videoId position="0 1.7 -2" />

<VideoPicker
  position="1.8 1.5 -2"
  bind:keyboardActive
  bind:handleKeyboard
  on:pick={(e) => {
    videoId = e.detail.pick;
  }} />

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
