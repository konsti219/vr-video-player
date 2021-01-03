<script>
  export let socket;
  export let room;
  export let keyboardActive;
  export let handleKeyboard;

  export let position = "0 0 0";
  export let rotation = "0 0 0";
</script>

<a-entity {position} {rotation}>
  <a-text
    font="dejavu"
    color="#DDD"
    position="0 0 0"
    scale="0.7 0.7"
    align="center"
    value={room.name} />
</a-entity>
