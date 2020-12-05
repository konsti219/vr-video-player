<script>
  export let socket;
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

  <a-entity id="scene-content" />

  <!---------------------->

  <a-entity id="keyboard-wrapper" visible="false">
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
