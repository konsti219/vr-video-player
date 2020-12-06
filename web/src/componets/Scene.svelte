<script>
  export let app;
  export let inGame;
  let socket = app.socket;
  let account = app.account;

  let keyboardActive = false;
  let scene = "";

  var input = "";
  function updateInput(e) {
    var code = parseInt(e.detail.code);
    switch (code) {
      case 8:
        input = input.slice(0, -1);
        break;
      case 6:
        alert("submitted");
        var keyboard = document.querySelector("#keyboard");
        document.querySelector("#input").setAttribute("value", input);
        document.querySelector("#input").setAttribute("color", "blue");
        keyboard.parentNode.removeChild(keyboard);
        return;
      default:
        input = input + e.detail.value;
        break;
    }
    document.querySelector("#input").setAttribute("value", input + "_");
  }
  document.addEventListener("a-keyboard-update", updateInput);
</script>

<!-- AFRAME SCENE -->
<a-scene keyboard-shortcuts="enterVR: false">
  <!-- ASSETS -->

  <a-assets>
    <img
      src="https://cdn.glitch.com/4f89165b-bcad-4fd8-9ca4-f92e4ca028e4%2Fwhite_grid_thin.png?v=1585644085396"
      id="grid"
      crossorigin="anonymous"
      alt="" />

    <img
      src="https://cdn.glitch.com/4f89165b-bcad-4fd8-9ca4-f92e4ca028e4%2Floading.png?v=1589751881220"
      id="loadingImg"
      crossorigin="anonymous"
      alt="" />

    <!-- DISPLAY VIDEO STREAM this will be rendered in the scene -->
    <video
      id="stream"
      crossorigin="anonymous"
      src="https://cdn.glitch.com/4f89165b-bcad-4fd8-9ca4-f92e4ca028e4%2Floading.mp4?v=1589651403926">
      <track kind="captions" />
    </video>
  </a-assets>

  <!---------------------->
  <!---------------------->

  <!-- CURSOR/CAMERA -->
  <a-camera universal-controls>
    <!--<a-entity
            id="cursor"
            cursor="fuse: true; fuseTimeout: 1000"
            position="0 0 -1"
            geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.025"
            material="color: #888; shader: flat; transparent: true; opacity: 0.3;"
            animation__click="property: scale; startEvents: click; easing: easeInCubic; dur: 150; from: 0.1 0.1 0.1; to: 1 1 1"
            animation__fusing="property: scale; startEvents: fusing; easing: easeInCubic; dur: 1000; from: 1 1 1; to: 0.1 0.1 0.1"
            animation__mouseleave="property: scale; startEvents: mouseleave; easing: easeInCubic; dur: 500; to: 1 1 1"
            raycaster="objects: .collidable"
          ></a-entity>-->
    <a-entity
      id="mouseCursor"
      raycaster="objects: .collidable"
      cursor="rayOrigin: mouse" />
  </a-camera>

  <!---------------------->

  <a-entity id="keyboard-wrapper" visible={keyboardActive}>
    <a-entity
      id="keyboard"
      position="-0.2 1.6 -0.5"
      a-keyboard
      style="display: none" />
    <a-text
      id="input"
      font="dejavu"
      color="#000"
      value="Input value..."
      scale="0.5 0.5 0.5"
      position="-0.2 2 -1" />
  </a-entity>

  <!---------------------->

  {#if scene == 'video'}
    <a-entity>
      <!-- VIDEO PLAYER -->
      <a-video src="#stream" width="2" height="1.125" position="0 1.6 -1.5" />

      <!-- CONTROLS -->
      <a-image
        id="controlPlay"
        class="collidable"
        position="0 0.7 -1.5"
        scale="0.6 0.6" />

      <a-image
        id="loading"
        position="0 1.6 -1.4"
        src="#loadingImg"
        scale="2 1.125" />

      <!-- RECOMMENDATIONS -->
      <a-entity position="2 4.1 -1" id="watchList" rotation="0 -45 0">
        <!--<a-plane color="darkgrey" position="0 0 1"></a-plane>-->
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
        scale="0.5 0.5" />

      <!---------------------->
    </a-entity>
  {:else if scene == 'register'}
    <template id="register-scene">
      <a-text
        font="dejavu"
        color="#000"
        value="Test"
        scale="0.5 0.5 0.5"
        position="-0.2 2 -1" />
    </template>

    <!---------------------->
  {:else}
    <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9" shadow />
    <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E" shadow />
    <a-cylinder
      position="1 0.75 -3"
      radius="0.5"
      height="1.5"
      color="#FFC65D"
      shadow />

    <!---------------------->
  {/if}

  <a-entity
    geometry="primitive: plane; width: 1; height: 1;"
    position="0 5 -5"
    rotation="0 0 0"
    material="color: red"
    class="collidable"
    on:click={() => {
      inGame = false;
      console.log('click');
    }} />
  <a-entity
    geometry="primitive: plane; width: 1; height: 1;"
    position="1 5 -5"
    rotation="0 0 0"
    material="color: blue"
    class="collidable"
    on:click={() => {
      keyboardActive = !keyboardActive;
    }} />

  <!-- ENVIRONMENT -->
  <a-entity
    geometry="primitive: plane; width: 10000; height: 10000;"
    rotation="-90 0 0"
    material="src: #grid; repeat: 10000 10000; transparent: true; opacity:0.3;" />
  <!--<a-sky color="#dbdedb"></a-sky>-->
  <a-sky color="#333340" />
  <a-entity light="color: #FFF; intensity: 1; type: ambient;" />
</a-scene>
<!-- END AFRAME SCENE -->

<!-- fuck you, csslint -->
<div class="a-enter-vr a-enter-ar a-enter-ar-button a-enter-vr-button" />
