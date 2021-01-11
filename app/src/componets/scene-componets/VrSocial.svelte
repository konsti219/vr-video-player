<script>
  import RoundedPlane from "./RoundedPlane.svelte";

  export let socket;
  export let room;
  export let keyboardActive;
  export let handleKeyboard;

  export let position = "0 0 0";
  export let rotation = "0 0 0";

  let tab = "current";
  const tabPositions = {
    current: "-0.6",
    find: "0",
    friends: "0.6",
  };
</script>

<a-entity {position} {rotation}>
  <a-text
    font="dejavu"
    color="#DDD"
    position="0 0 0"
    scale="0.7 0.7"
    align="center"
    value={room.name} />

  <!-- Tab selector -->
  <a-text
    font="dejavu"
    color="#DDD"
    position="-0.6 1.45 0"
    scale="0.6 0.6"
    align="center"
    value="Current\nRoom" />

  <a-text
    font="dejavu"
    color="#DDD"
    position="0 1.45 0"
    scale="0.6 0.6"
    align="center"
    value="Find\nRoom" />

  <a-text
    font="dejavu"
    color="#DDD"
    position="0.6 1.45 0"
    scale="0.6 0.6"
    align="center"
    value="Friends" />

  <RoundedPlane
    color="#333"
    width="0.7"
    height="0.35"
    radius="0.1"
    position="{tabPositions[tab]} 1.45 -0.01" />

  <RoundedPlane
    color="#333"
    width="2"
    height="2.5"
    radius="0.1"
    position="0 0 -0.01" />
</a-entity>
