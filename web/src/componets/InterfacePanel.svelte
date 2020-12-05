<script>
  export let icon;
  export let iconRotation = "0deg";
</script>

<style>
  .container {
    width: 90%;
    max-width: 700px;
    height: 100%;
    margin: auto;
    position: relative;
  }

  .center {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    width: 100%;
    display: grid;
  }

  .icon-section {
    display: grid;
    grid-template-columns: 1fr 4fr;
  }
  .icon {
    position: relative;
  }
  .icon-inner {
    font-size: min(14vw, 140px);
    position: absolute;
    top: 50%;
    left: 50%;
  }
  .text {
    text-align: center;
    font-size: 1.8em;
    width: 100%;
  }
  .text-inner {
    display: block;
    padding: 1vh;
  }
</style>

<!-- wraps everything and aligns horizontally -->
<div class="container">
  <!-- aligns vertically -->
  <div class="center" style="grid-template-columns: 1fr {icon ? '4fr' : ''};">
    {#if icon}
      <!-- with icon -->
      <div class="icon">
        <i
          class="fas {icon} icon-inner"
          style="transform: translate(-50%, -50%) rotate({iconRotation});" />
      </div>
    {/if}
    <div class="text">
      <div class="text-inner">
        <slot />
      </div>
    </div>
  </div>
</div>
