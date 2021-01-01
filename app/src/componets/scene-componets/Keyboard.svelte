<script>
  import { createEventDispatcher, onMount } from "svelte";

  import keys from "./keyboard/en.js";

  export let position = "0 0 0";
  export let rotation = "0 0 0";
  export let keyboardActive;

  let mode = "normal";
  let input = "";

  const dispatch = createEventDispatcher();

  const handleKey = (e) => {
    switch (e.target.getAttribute("data-keytype")) {
      case "delete":
        input = input.slice(0, -1);
        break;
      case "enter":
        input = input + "\n";
        break;
      case "shift":
        if (mode === "shift") mode = "normal";
        else mode = "shift";
        break;
      case "alt":
        if (mode === "alt") mode = "normal";
        else mode = "alt";
        break;
      case "cancel":
        keyboardActive = false;
        dismiss();
        break;
      case "submit":
        dispatch("submit", {
          text: input,
        });
        dismiss();
        break;
      case "standard":
        input = input + e.target.getAttribute("data-keyvalue");
        break;

      default:
        console.log("oops");
    }
  };

  const dismiss = () => {
    input = "";
    mode = "normal";
  };

  $: ((k) => {
    if (!k) dismiss();
  })(keyboardActive);

  const KEYBOARD_PADDING = 0.02;
  const KEY_PADDING = 0.004;
  const KEY_SIZE = 0.04;

  const keysX = keys[mode][0].length;
  const keysY = keys[mode].length;
  const keyboardWidth =
    KEY_SIZE * keysX + KEY_PADDING * (keysX - 1) + KEYBOARD_PADDING * 2;
  const keyboardHeight =
    KEY_SIZE * keysY + KEY_PADDING * (keysY - 1) + KEYBOARD_PADDING * 2;
</script>

{#if keyboardActive}
  <a-entity
    id="keyboard"
    {position}
    {rotation}
    geometry="primitive: plane; width: {keyboardWidth}; height: {keyboardHeight}"
    material="color: #4a4a4a; side: double;"
    class="collidable">
    <a-text
      value={input + '_'}
      font="dejavu"
      color="#000"
      position="{-keyboardWidth / 2} 0.21 0"
      width={keyboardWidth}
      wrap-count="15" />
    <a-entity
      position="{-keyboardWidth / 2 + KEYBOARD_PADDING} {-keyboardHeight / 2 + KEYBOARD_PADDING} 0.001">
      {#each keys[mode] as row, y}
        {#each row as key, x}
          {#if key.type !== 'empty'}
            <!-- If there is key.x or key.y translate the key to be in the middle of that space-->
            <a-entity
              position="{key.x ? ((key.x - 1) * (KEY_SIZE + KEY_PADDING)) / 2 : 0} {key.y ? (-(key.y - 1) * (KEY_SIZE + KEY_PADDING)) / 2 : 0} 0">
              <!-- actual key with position being calculated from y and x, plane size also being set -->
              <a-entity
                position="{x * (KEY_SIZE + KEY_PADDING) + KEY_SIZE / 2} {-y * (KEY_SIZE + KEY_PADDING) + keyboardHeight - KEY_SIZE - KEYBOARD_PADDING} 0"
                geometry="primitive: plane; width: {key.x ? KEY_SIZE * key.x + KEY_PADDING * (key.x - 1) : KEY_SIZE}; 
                                            height: {key.y ? KEY_SIZE * key.y + KEY_PADDING * (key.y - 1) : KEY_SIZE}"
                material="color: #666666;"
                class="collidable"
                data-keytype={key.type}
                data-keyvalue={key.value}
                on:mouseenter={(e) => e.target.setAttribute('material', 'color: #99a7de;')}
                on:mouseleave={(e) => e.target.setAttribute('material', 'color: #666666;')}
                on:click={handleKey}>
                <a-text
                  value={key.value}
                  font="dejavu"
                  color="#DDD"
                  align="center"
                  baseline="center"
                  width="0.5" />
              </a-entity>
            </a-entity>
          {/if}
        {/each}
      {/each}
    </a-entity>
  </a-entity>
{/if}
