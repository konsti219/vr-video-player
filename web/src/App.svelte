<script>
  import Scene from "./componets/Scene.svelte";
  import Interface from "./componets/Interface.svelte";
</script>

<style>
  main {
    margin: 0;
    padding: 0;
    display: block;
    height: 100%;
    width: 100%;
    position: relative;
  }
</style>

<!-- CONTAINER -->
<main>
  <Scene />
  <Interface />
</main>
