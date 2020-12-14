<script>
  import { onDestroy, createEventDispatcher } from "svelte";

  import VrButton from "./VrButton.svelte";

  export let keyboardActive;
  export let handleKeyboard;
  export let position = "0 0 0";

  let pickingVideo = false;
  const dispatch = createEventDispatcher();

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
        dispatch("pick", {
          pick: e.detail.text,
        });

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

<a-entity {position}>
  <VrButton
    position="0 0 0"
    scale="0.6 0.6"
    charcode="f87c"
    bind:active={pickingVideo}
    on:click={changePicking} />

  <a-text
    font="dejavu"
    color="#000"
    position="0 0.5 0"
    scale="0.5 0.5"
    align="center"
    value={pickingVideo ? "Pick a video by typing\n it's id into the keyboard \n(like 'iik25wqIuFo')" : 'Video picker'} />
</a-entity>
