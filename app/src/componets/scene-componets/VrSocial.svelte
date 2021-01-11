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

  let pickingRoomCode = false;
  const disableKeyboard = () => {
    keyboardActive = false;
    pickingRoomCode = false;
    handleKeyboard = (e) => console.log(e.detail.text);
  };
  const changeKeyboard = (k) => {
    if (!k && pickingRoomCode) {
      disableKeyboard();
    }
  };
  const changeRoomCode = () => {
    pickingRoomCode = !pickingRoomCode;
    if (pickingRoomCode) {
      keyboardActive = true;
      handleKeyboard = (e) => {
        console.log("pick code", e.detail.text);
        socket.emit("room.join", {
          roomCode: e.detail.text.toUpperCase(),
        });

        disableKeyboard();
      };
    } else {
      disableKeyboard();
    }
  };
  $: changeKeyboard(keyboardActive);
</script>

<a-entity {position} {rotation}>
  <!-- Tab selector -->
  <a-text
    font="dejavu"
    color="#DDD"
    position="-0.6 1.45 0"
    scale="0.6 0.6"
    align="center"
    value="Current\nRoom" />
  <a-plane
    position="-0.6 1.45 0"
    width="0.6"
    height="0.4"
    class="collidable"
    visible="false"
    on:click={() => (tab = 'current')} />

  <a-text
    font="dejavu"
    color="#DDD"
    position="0 1.45 0"
    scale="0.6 0.6"
    align="center"
    value="Find\nRoom" />
  <a-plane
    position="0 1.45 0"
    width="0.6"
    height="0.4"
    class="collidable"
    visible="false"
    on:click={() => (tab = 'find')} />

  <a-text
    font="dejavu"
    color="#DDD"
    position="0.6 1.45 0"
    scale="0.6 0.6"
    align="center"
    value="Friends" />
  <a-plane
    position="0.6 1.45 0"
    width="0.6"
    height="0.4"
    class="collidable"
    visible="false"
    on:click={() => (tab = 'friends')} />

  <RoundedPlane
    color="#333"
    width="0.7"
    height="0.35"
    radius="0.1"
    position="{tabPositions[tab]} 1.45 -0.01" />

  <!-- Tab content -->
  {#if tab === 'current'}
    <!-- current room -->

    <a-text
      font="dejavu"
      color="#DDD"
      position="0 1.1 0"
      scale="0.7 0.7"
      align="center"
      value={room.name} />
    <a-text
      font="dejavu"
      color="#DDD"
      position="0 0.9 0"
      scale="0.6 0.6"
      align="center"
      value="Room code: {room.roomCode}" />
  {:else if tab === 'find'}
    <!-- find room -->

    <a-text
      font="dejavu"
      color="#DDD"
      position="0 1.1 0"
      scale="0.7 0.7"
      align="center"
      value="Find rooms" />

    <a-text
      font="dejavu"
      color="#DDD"
      position="0 0.9 0"
      scale="0.6 0.6"
      align="center"
      value="click to join\nusind room code" />
    <a-plane
      position="0 0.9 0"
      width="1.6"
      height="0.4"
      class="collidable"
      visible="false"
      on:click={changeRoomCode} />
  {:else if tab === 'friends'}
    <!-- friends -->

    <a-text
      font="dejavu"
      color="#DDD"
      position="0 0 0"
      scale="0.7 0.7"
      align="center"
      value="friends, coming soon" />
  {/if}

  <RoundedPlane
    color="#333"
    width="2"
    height="2.5"
    radius="0.1"
    position="0 0 -0.01" />
</a-entity>
