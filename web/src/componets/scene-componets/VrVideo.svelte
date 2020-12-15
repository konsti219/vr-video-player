<script>
  import VrButton from "./VrButton.svelte";
  import { onMount } from "svelte";

  export let position = "0 0 0";
  export let videoId;
  export let playing = false;
  export let autoplay = false;

  let loaded = false;
  let video;

  const setVideo = (id) => {
    console.log("loading video", id);

    if (videoId && videoId !== "") {
      loaded = false;
      video.setAttribute(
        "src",
        "https://ytraw.glitch.me/watch?proxy=https://konsti-proxy.herokuapp.com/&v=" +
          id
      );
    }
  };
  $: video ? setVideo(videoId) : null;

  export function play() {
    if (loaded) {
      video.play();
    }
  }
  export function pause() {
    if (loaded) {
      video.pause();
    }
  }
  export function change() {
    if (playing) {
      pause();
    } else {
      play();
    }
  }

  onMount(() => {
    video.addEventListener("loadedmetadata", () => {
      console.log("loaded metadata");
      loaded = true;
      if (autoplay) {
        play();
      }
    });
    video.addEventListener("play", () => (playing = true));
    video.addEventListener("pause", () => (playing = false));
  });
</script>

<a-assets>
  <video id="stream" bind:this={video} crossorigin="anonymous">
    <track kind="captions" />
  </video>
</a-assets>

<a-entity {position}>
  {#if videoId && videoId !== ''}
    {#if loaded}
      <a-video src="#stream" width="2" height="1.125" position="0 0 0" />
    {:else}
      <a-image position="0 0 0" src="#loadingImg" scale="2 1.125" />
    {/if}
  {:else}
    <a-text
      font="dejavu"
      color="#000"
      position="0 0 0"
      align="center"
      value="No video seleted" />
  {/if}

  {#if playing}
    <VrButton
      position="0 -1 0"
      scale="0.6 0.6"
      charcode="f04c"
      on:click={pause} />
  {:else}
    <VrButton
      position="0 -1 0"
      scale="0.6 0.6"
      charcode="f04b"
      on:click={play} />
  {/if}
</a-entity>
