<script>
  import InterfacePanel from "./InterfacePanel.svelte";

  export let app;
  let socket = app.socket;

  export let inGame;
  export let account;
  let isMobile = false;
  let orientationReady = false;
  let loggedIn = false;
  let fullscreenActive = false;
  let gameReady = false;

  // check device info
  try {
    document.createEvent("TouchEvent");
    isMobile = true;
  } catch (e) {}
  fullscreenActive = new URL(location.href).searchParams.get("novr") == "true";

  //
  //! LOGIN
  //

  // transfer cookie to ls, because setting cookies on server is easier
  const getCookie = (cookie) => {
    const val = document.cookie
      .split("; ")
      .find((row) => row.split("=")[0] === cookie);
    return val ? val.split("=")[1] : val;
  };
  if (getCookie("userId")) {
    localStorage.setItem("userId", getCookie("userId"));
    localStorage.setItem("token", getCookie("userToken"));
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }

  // check login
  (async () => {
    // check if token present
    if (localStorage.getItem("userId") && localStorage.getItem("token")) {
      // present, validate
      console.log("checking token");
      const data = await (
        await fetch(
          `/api/auth/token/validate?userId=${localStorage.getItem(
            "userId"
          )}&token=${localStorage.getItem("token")}`
        )
      ).json();
      loggedIn = data.valid;

      // start socket
      socket.emit("auth", {
        userId: localStorage.getItem("userId"),
        token: localStorage.getItem("token"),
      });
    }
    if (!loggedIn) {
      // not present, remove
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
    }
  })();

  //
  //! UI Interactions
  //

  const handleResize = () => {
    orientationReady = !isMobile || window.innerHeight < window.innerWidth;
  };
  window.addEventListener("resize", handleResize);
  handleResize();

  $: gameReady =
    loggedIn && (!isMobile || orientationReady) && fullscreenActive;

  const handleClick = (e) => {
    if (loggedIn && (!isMobile || orientationReady) && !fullscreenActive) {
      document.querySelector("main").requestFullscreen();
    }
  };
  window.addEventListener("fullscreenchange", () => {
    // weird thing to get svelte to rerender
    if (document.fullscreenElement) {
      fullscreenActive = true;
    } else {
      fullscreenActive = false;
    }
  });

  const handleGameEnter = () => {
    if (gameReady) {
      inGame = true;
    }
  };
</script>

<style>
  .interface {
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    background-color: var(--background-primary);
    height: 100%;
    width: 100%;
  }

  /* elemnts in the corners */
  .side-element {
    position: absolute;
    width: fit-content;
    padding: 1.5vh;
  }

  .top {
    top: 1.5vh;
  }
  .bottom {
    bottom: 1.5vh;
  }
  .left {
    left: 1.5vh;
  }
  .right {
    right: 1.5vh;
  }

  .logo {
    height: 1em;
    display: flex;
    align-items: center;
    width: calc(100vw - 6vh);
  }
  #logo-img {
    height: 1em;
  }
  #logo-text {
    font-size: 0.8em;
    padding-left: 0.5em;
  }

  .small {
    height: fit-content;
    font-size: 0.8em;
  }
  .big {
    font-size: 2em;
    width: fit-content;
    padding: 1.5vh;
    margin: 0 auto;
    border: 3px solid var(--background-secondary);
  }

  .button {
    font-size: 1.5em;
    display: flex;
    align-items: center;
    border-radius: 0.5vh;
    cursor: pointer;
  }
  .button:hover {
    background-color: var(--background-secondary);
  }
  .button > span {
    padding-right: 0.8em;
    padding-left: 0.1em;
  }
</style>

<!-- START PROMPT -->
{#if !inGame || !gameReady}
  <div class="interface" on:click={handleClick}>
    <!-- upper logo -->
    <div class="side-element top left logo">
      <img id="logo-img" src="/images/vr_icon.svg" alt="VR-video-player logo" />
      <span id="logo-text">VR Video Player</span>
    </div>

    <!-- start prompt content -->

    <!-- loading -->
    <!--<InterfacePanel>Loading...</InterfacePanel>-->

    {#if !loggedIn}
      <!-- login icon="fa-sign-in-alt" -->
      <InterfacePanel>
        Login to start
        <br /><br />
        <a href="/api/auth/google">Login with Google</a>
      </InterfacePanel>

      <!---->
    {:else if isMobile && !orientationReady}
      <!-- landscape -->
      <InterfacePanel icon="fa-mobile-alt" iconRotation="270deg">
        Please turn your device to landscape
      </InterfacePanel>

      <!---->
    {:else if !fullscreenActive}
      <!-- fullscreen -->
      <InterfacePanel icon="fa-expand">
        Click to enter fullscreen
      </InterfacePanel>

      <!---->
    {:else}
      <!-- enter -->
      <InterfacePanel>
        <span>Welcome{#if account.name != '[NEW]'}, {account.name}{/if}</span>
        <br /><br />
        <span class="button big" on:click={handleGameEnter}>Start</span><br />
      </InterfacePanel>

      <!-- logout and exit buttons -->
      <div
        class="side-element top right button"
        on:click={() => document.exitFullscreen()}>
        <span>Exit</span>
        <i class="fas fa-door-open" />
      </div>
      <div
        class="side-element bottom right button"
        on:click={() => {
          localStorage.removeItem('userId');
          location.reload();
        }}>
        <span>Sign out</span>
        <i class="fas fa-sign-out-alt" />
      </div>

      <!---->
    {/if}

    <div class="side-element bottom left small">
      <a class="link" href="/privacy.html">Privacy Policy</a>
    </div>
  </div>
  <!-- START PROMPT END -->
{/if}
