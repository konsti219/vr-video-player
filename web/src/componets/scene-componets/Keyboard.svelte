<script>
  export let keyboardActive;
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let input = "";
  const updateInput = (e) => {
    const code = parseInt(e.detail.code);
    switch (code) {
      case 8:
        input = input.slice(0, -1);
        break;
      case 6:
        keyboardActive = false;
        dispatch("submit", {
          text: input,
        });
        input = "";
      default:
        input = input + e.detail.value;
        break;
    }
  };
  document.addEventListener("a-keyboard-update", updateInput);
</script>

<a-entity id="keyboard-wrapper" visible={keyboardActive}>
  <a-entity id="keyboard" position="-0.2 0 -0.5" a-keyboard />
  <a-text
    id="input"
    font="dejavu"
    color="#000"
    value={input + '_'}
    scale="0.5 0.5 0.5"
    position="-0.4 0.3 -1" />
</a-entity>
