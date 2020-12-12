<script>
  import { createEventDispatcher, onMount } from "svelte";

  export let position = "0 1 -1";
  export let rotation = "0 0 0";
  export let charcode = "f2b4";
  export let active = false;

  let image;
  let hovering = false;
  const colorDefault = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--text-color");
  const colorActive = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--link-color");
  const colorHover = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--background-secondary");

  const drawIncon = () => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const fontSize = 800 / (1024 / size);
    const position = size / 2;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = hovering ? colorHover : active ? colorActive : colorDefault;
    ctx.font = fontSize + "px FontAwesome";
    ctx.fillText(String.fromCharCode("0x" + charcode), position, position);

    image.setAttribute("src", canvas.toDataURL());
  };

  onMount(() => {
    drawIncon();
  });

  const handleEnter = () => {
    hovering = true;
    drawIncon();
  };

  const handleLeave = () => {
    hovering = false;
    drawIncon();
  };

  const dispatch = createEventDispatcher();
  const handleClick = () => {
    dispatch("click", {});
  };
</script>

<a-image
  bind:this={image}
  on:mouseenter={handleEnter}
  on:mouseleave={handleLeave}
  on:click={handleClick}
  class="collidable"
  {position}
  {rotation}
  scale="0.6 0.6" />
