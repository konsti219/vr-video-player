<script>
  import InterfacePanel from "./InterfacePanel.svelte";

  export let socket;
  console.log(socket);

  let inGame = false;
  let isMobile = false;
  let novr = false;
  let orientationReady = false;
  let loggedIn = false;

  // check device info
  try {
    document.createEvent("TouchEvent");
    isMobile = true;
  } catch (e) {}
  novr = new URL(location.href).searchParams.get("novr") === "true";

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

  /*
  $("#start-prompt").on("click", (e) => {
    if (app.readyFullscreen && !app.novr && !document.fullScreenElement) {
      $("#container")[0].requestFullscreen();
    }
  });*/

  /*$("#start-prompt-enter-button").on("click", () => {
    app.inGame = true;
    stateChange();
  });*/
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

  /* logo */
  #start-prompt-logo {
    position: absolute;
    height: 1em;
    top: 3vh;
    left: 3vh;
    display: flex;
    align-items: center;
    width: calc(100vw - 6vh);
  }
  #start-prompt-logo-img {
    height: 1em;
  }
  #start-prompt-logo-text {
    font-size: 0.8em;
    padding-left: 0.5em;
  }

  /* lower */
  #start-prompt-lower {
    position: absolute;
    height: fit-content;
    font-size: 0.8em;
    bottom: 3vh;
    left: 3vh;
  }
</style>

<!-- START PROMPT -->
{#if !inGame}
  <div class="interface">
    <!-- upper logo -->
    <div id="start-prompt-logo">
      <img
        id="start-prompt-logo-img"
        src="/images/vr_icon.svg"
        alt="VR-video-player logo" />
      <span id="start-prompt-logo-text">VR Video Player</span>
    </div>

    <!-- start prompt content -->

    <!-- loading -->
    <!--<InterfacePanel>Loading...</InterfacePanel>-->

    {#if !loggedIn}
      <!-- login -->
      <InterfacePanel>
        Login to start
        <br /><br />
        <a href="/api/auth/google">Login with Google</a>
      </InterfacePanel>
    {:else if isMobile && !orientationReady}
      <!-- landscape -->
      <InterfacePanel icon="fa-mobile-alt">
        Please turn your device to landscape
      </InterfacePanel>
    {:else}
      <InterfacePanel>
        enter
        <span
          onclick="localStorage.removeItem('userId');location.reload();">Logout</span>
      </InterfacePanel>
      <!-- fullscreen -->
      <!--<i class="fas fa-expand start-prompt-icon-inner" />
      <div class="start-prompt-text-inner">Click to enter fullscreen</div>

      <!-- enter -->
      <!--<div class="start-prompt-text">
        Welcome<span id="prompt-user-name">, ...</span><br /><br />
        <a id="start-prompt-enter-button">Enter</a>
        <span
          onclick="localStorage.removeItem('userId');location.reload();">Logout</span>
      </div>-->
    {/if}

    <div id="start-prompt-lower">
      <a href="/privacy.html">Privacy Policy</a>
    </div>
  </div>
  <!-- START PROMPT END -->
{/if}
