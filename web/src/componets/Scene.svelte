<script>
  import "aframe";
  import "aframe-extras";

  import Keyboard from "./scene-componets/Keyboard.svelte";
  import RegisterScene from "./scene-componets/RegisterScene.svelte";
  import VideoScene from "./scene-componets/VideoScene.svelte";
  import VrButton from "./scene-componets/VrButton.svelte";

  export let app;
  let socket = app.socket;

  export let inGame;
  export let account;

  let keyboardActive = false;
  // function called
  const keyboardSubmitted = (e) => handleKeyboard(e);
  // function that can be overwritten for components to take control of the keyboard
  let handleKeyboard = (e) => console.log(e.detail.text);

  let scene;
  $: scene = inGame ? (account.name === "[NEW]" ? "register" : "video") : "";
</script>

<!-- AFRAME SCENE -->
<a-scene keyboard-shortcuts="enterVR: false">
  <!-- ASSETS -->

  <a-assets>
    <img
      src="/images/white_grid_thin.png"
      id="grid"
      crossorigin="anonymous"
      alt="" />

    <img
      src="/images/loading.png"
      id="loadingImg"
      crossorigin="anonymous"
      alt="" />
  </a-assets>

  <!---------------------->
  <!---------------------->

  <!-- CURSOR/CAMERA -->

  <!--
  <a-entity
    id="cursor"
    cursor="fuse: true; fuseTimeout: 1000"
    position="0 0 -1"
    geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.025"
    material="color: #888; shader: flat; transparent: true; opacity: 0.3;"
    animation__click="property: scale; startEvents: click; easing: easeInCubic; dur: 150; from: 0.1 0.1 0.1; to: 1 1 1"
    animation__fusing="property: scale; startEvents: fusing; easing: easeInCubic; dur: 1000; from: 1 1 1; to: 0.1 0.1 0.1"
    animation__mouseleave="property: scale; startEvents: mouseleave; easing: easeInCubic; dur: 500; to: 1 1 1"
    raycaster="objects: .collidable" />-->

  <!--="enabled: {!keyboardActive}"-->
  <a-entity id="rig" movement-controls position="0 0 0">
    <a-entity camera position="0 1.6 0" look-controls>
      <a-entity
        id="mouseCursor"
        raycaster="objects: .collidable"
        cursor="rayOrigin: mouse" />
    </a-entity>
    <Keyboard
      bind:keyboardActive
      on:submit={keyboardSubmitted}
      position="0 1.3 -0.3"
      rotation="-30 0 0" />
  </a-entity>

  {#if scene === 'video'}
    <VideoScene bind:keyboardActive bind:handleKeyboard bind:socket />
  {:else if scene === 'register'}
    <RegisterScene bind:keyboardActive bind:handleKeyboard bind:socket />
  {:else}
    <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9" shadow />
    <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E" shadow />
    <a-cylinder
      position="1 0.75 -3"
      radius="0.5"
      height="1.5"
      color="#FFC65D"
      shadow />
  {/if}

  <VrButton
    position="0 3 -2"
    scale="0.6 0.6"
    charcode="f52b"
    on:click={() => {
      inGame = false;
    }} />
  <VrButton
    position="0.8 3 -2"
    scale="0.6 0.6"
    charcode="f11c"
    bind:active={keyboardActive}
    on:click={() => {
      keyboardActive = !keyboardActive;
    }} />

  <!-- ENVIRONMENT -->
  <a-entity
    geometry="primitive: plane; width: 1000; height: 1000;"
    rotation="-90 0 0"
    material="src: #grid; repeat: 1000 1000; transparent: true; opacity:0.3;" />
  <!--<a-sky color="#dbdedb"></a-sky>-->
  <a-sky color="#333340" />
  <a-entity light="color: #FFF; intensity: 1; type: ambient;" />
</a-scene>
<!-- END AFRAME SCENE -->

<!-- fuck you, csslint -->
<div class="a-enter-vr a-enter-ar a-enter-ar-button a-enter-vr-button" />
