<script>
  import { onDestroy } from "svelte";

  import VrButton from "./VrButton.svelte";
  import VrVideo from "./VrVideo.svelte";

  export let keyboardActive;
  export let handleKeyboard;
  export let socket;

  socket.on("videos", (p) => {
    console.log(p);
  });

  let pickingVideo = false;
  let vrVideo;

  const disable = () => {
    keyboardActive = false;
    pickingVideo = false;
    handleKeyboard = (e) => console.log(e.detail.text);
  };
  const changeKeyboard = (k) => {
    if (!k && pickingVideo) {
      disable();
    }
  };
  const changePicking = () => {
    pickingVideo = !pickingVideo;
    if (pickingVideo) {
      keyboardActive = true;
      handleKeyboard = (e) => {
        console.log("picked: ", e.detail.text);

        disable();
      };
    } else {
      disable();
    }
  };
  $: changeKeyboard(keyboardActive);

  onDestroy(() => {
    disable();
  });
</script>

<VrVideo position="0 1.7 -2" />

<VrButton
  position="2 1.5 -2"
  scale="0.6 0.6"
  charcode="f87c"
  bind:this={vrVideo}
  bind:active={pickingVideo}
  on:click={changePicking} />

<a-text
  font="dejavu"
  color="#000"
  position="2 2 -1.9"
  scale="0.5 0.5"
  align="center"
  value={pickingVideo ? "Pick a video by typing\n it's id into the keyboard \n(like 'iik25wqIuFo')" : 'Video picker'} />

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
