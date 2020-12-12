<script>
  import { createEventDispatcher } from "svelte";
  import "./../../lib/index.js";

  export let keyboardActive;

  const dispatch = createEventDispatcher();

  const handleSubmit = (e) => {
    dispatch("submit", {
      text: e.detail.value,
    });
  };

  const handleDismiss = (e) => {
    keyboardActive = false;
  };
</script>

{#if keyboardActive}
  <a-entity
    id="keyboard"
    super-keyboard="hand: #mouseCursor; imagePath:/images; multipleInputs:true"
    position="0 1.076 -0.5"
    rotation="-30 0 0"
    on:superkeyboardinput={handleSubmit}
    on:superkeyboarddismiss={handleDismiss} />
{/if}
