<script>
  import VrButton from "./VrButton.svelte";
  import { onMount } from "svelte";

  export let videoId;
  export let playing = false;
  export let autoplay = false;

  let loaded = false;
  let video;

  const setVideo = (id) => {
    console.log("loading video");
    loaded = false;
    video.setAttribute(
      "src",
      "https://ytraw.glitch.me/watch?proxy=https://konsti-proxy.herokuapp.com/&v=" +
        id
    );
  };
  $: video ? setVideo(videoId) : null;

  export function play() {
    video.play();
  }
  export function pause() {
    video.pause();
  }
  export function change() {
    //change
  }

  onMount(() => {
    video.addEventListener("loadedmetadata", () => {
      console.log("loaded metadata");
      loaded = true;
      if (autoplay) {
        play();
      } /*else {
        video.muted = true;
        play();
        setTimeout(() => {
          pause();
          video.muted = false;
        }, 100);
      }*/
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

{#if loaded}
  <a-video src="#stream" width="2" height="1.125" position="0 1.7 -2" />
{:else}
  <a-image position="0 1.7 -2" src="#loadingImg" scale="2 1.125" />
{/if}

{#if playing}
  <VrButton
    position="0 0.7 -2"
    scale="0.6 0.6"
    charcode="f04c"
    on:click={pause} />
{:else}
  <VrButton
    position="0 0.7 -2"
    scale="0.6 0.6"
    charcode="f04b"
    on:click={play} />
{/if}
