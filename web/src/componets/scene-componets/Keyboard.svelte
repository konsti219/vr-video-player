<script>
  import { createEventDispatcher, onMount } from "svelte";
  import "aframe-super-keyboard";

  export let keyboardActive;

  const dispatch = createEventDispatcher();

  onMount(() => {
    document
      .getElementById("keyboard")
      .addEventListener("superkeyboarddismiss", (e) => {
        console.log("dismissed");
      });

    document
      .getElementById("keyboard")
      .addEventListener("superkeyboardinput", (e) => {
        dispatch("submit", {
          text: e.detail.value,
        });
      });
  });
</script>

<a-entity id="keyboard-wrapper" visible={keyboardActive}>
  <a-entity
    id="keyboard"
    super-keyboard="hand: #mouseCursor; imagePath:/images; multipleInputs:true"
    position="0 1.076 -0.5"
    rotation="-30 0 0" />
</a-entity>
