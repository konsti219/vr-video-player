<script>
  import { onDestroy, onMount } from "svelte";
  export let keyboardActive;
  export let handleKeyboard;
  export let socket;

  onMount(() => {
    keyboardActive = true;
    handleKeyboard = (e) => {
      socket.emit("account.changename", {
        name: e.detail.text,
      });
    };
  });
  onDestroy(() => {
    keyboardActive = false;
    handleKeyboard = (e) => console.log(e.detail.text);
  });
</script>

<a-text
  font="dejavu"
  color="#000"
  scale="1 1 1"
  position="0 2.5 -3"
  align="center"
  value="Welcome! \n Choose a name" />
