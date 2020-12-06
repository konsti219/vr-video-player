<script>
  export let keyboardActive;
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let input = "";
  let lastCode = 0;
  const updateInput = (e) => {
    if (keyboardActive) {
      const code = parseInt(e.detail.code);
      if (code != lastCode) {
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
        lastCode = code;
      } else {
        lastCode = 0;
      }
    }
  };
  document.addEventListener("a-keyboard-update", updateInput);
</script>

<a-entity id="keyboard-wrapper" visible={keyboardActive}>
  <a-entity id="keyboard" position="-0.24 0 -0.3" a-keyboard />
  <a-text
    id="input"
    font="dejavu"
    color="#000"
    align="center"
    value={input + '_'}
    scale="0.5 0.5 0.5"
    position="0 0.2 -0.3" />
</a-entity>
