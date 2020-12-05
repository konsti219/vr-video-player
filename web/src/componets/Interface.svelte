<script>
  let inGame = false;
  let isMobile = false;
  let novr = false;

  let app = {
    readyFullscreen: false,
    /*setPrompt: (id) => {
      $("#start-prompt-content").children().css("display", "none");
      $(id).css("display", "block");
      $("#start-prompt").css("display", "block");
    },*/
    loggedIn: false,
    novr: false,
    socketReady: false,
  };

  // check device info
  try {
    document.createEvent("TouchEvent");
    isMobile = true;
  } catch (e) {}
  novr = new URL(location.href).searchParams.get("novr") === "true";

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

  // fullscreen force
  const stateChange = () => {
    console.log("state change");

    if (!app.loggedIn) {
      app.setPrompt("#start-prompt-login");
      return;
    }
    if (!app.socketReady) initSocket();

    // check landscape
    if (app.isMobile && window.innerHeight > window.innerWidth) {
      app.setPrompt("#start-prompt-landscape");
      app.readyFullscreen = false;
      return;
    } else {
      app.readyFullscreen = true;
    }

    /*
    if (document.fullscreenElement || app.novr) {
      app.setPrompt("#start-prompt-enter");
      if (app.inGame) $("#start-prompt").css("display", "none");
    } else {
      app.setPrompt("#start-prompt-fullscreen");
    }*/

    // render enter prompt
    if (app.account) {
      /*
      $("#prompt-user-name").text(
        app.account.name === "[NEW]" ? "" : ", " + app.account.name
      );*/
    }
  };
  /*
  $(window).on("resize", (e) => stateChange());
  $(document).on("fullscreenchange", (e) => stateChange());

  $("#start-prompt").on("click", (e) => {
    if (app.readyFullscreen && !app.novr && !document.fullScreenElement) {
      $("#container")[0].requestFullscreen();
    }
  });

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

  /* content */
  .start-prompt-center {
    width: 90%;
    max-width: 700px;
    height: fit-content;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .start-prompt-icon-section {
    display: grid;
    grid-template-columns: 1fr 4fr;
  }
  .start-prompt-icon {
    position: relative;
  }
  .start-prompt-icon-inner {
    font-size: min(14vw, 140px);
    transform: translate(-50%, -50%) rotate(270deg);
    position: absolute;
    top: 50%;
    left: 50%;
  }
  .start-prompt-text {
    text-align: center;
    font-size: 1.8em;
    height: fit-content;
  }
  .start-prompt-text-inner {
    display: block;
    margin: auto;
    padding: 1vh;
    height: fit-content;
    width: calc(80% - 2vh);
    top: 50%;
    position: absolute;
    transform: translate(0, -50%);
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
  <div class="interface" style="display: block">
    <!-- upper logo -->
    <div id="start-prompt-logo">
      <img
        id="start-prompt-logo-img"
        src="/images/vr_icon.svg"
        alt="VR-video-player logo" />
      <span id="start-prompt-logo-text">VR Video Player</span>
    </div>

    <!-- start prompt content -->
    <div
      id="start-prompt-content"
      class="start-prompt-section"
      style="display: block">
      <!-- loading -->
      <div
        id="start-prompt-loading"
        class="start-prompt-center"
        style="display: block">
        <div class="start-prompt-text">Loading...</div>
      </div>

      <!-- login -->
      <div
        id="start-prompt-login"
        class="start-prompt-center"
        style="display: none">
        <div class="start-prompt-text center">
          Login to start
          <br /><br />
          <a href="/api/auth/google">Login with Google</a>
        </div>
      </div>

      <!-- landscape -->
      <div
        id="start-prompt-landscape"
        class="start-prompt-center"
        style="display: none">
        <div class="start-prompt-icon-section">
          <div class="start-prompt-icon">
            <i class="fas fa-mobile-alt start-prompt-icon-inner" />
          </div>
          <div class="start-prompt-text">
            <div class="start-prompt-text-inner">
              Please turn your device to landscape
            </div>
          </div>
        </div>
      </div>

      <!-- fullscreen -->
      <div
        id="start-prompt-fullscreen"
        class="start-prompt-center"
        style="display: none">
        <div class="start-prompt-icon-section">
          <div class="start-prompt-icon">
            <i class="fas fa-expand start-prompt-icon-inner" />
          </div>
          <div class="start-prompt-text">
            <div class="start-prompt-text-inner">Click to enter fullscreen</div>
          </div>
        </div>
      </div>

      <!-- enter -->
      <div
        id="start-prompt-enter"
        class="start-prompt-center"
        style="display: none">
        <div class="start-prompt-text">
          Welcome<span id="prompt-user-name">, ...</span><br /><br />
          <a id="start-prompt-enter-button">Enter</a>
          <span
            onclick="localStorage.removeItem('userId');location.reload();">Logout</span>
        </div>
      </div>
    </div>

    <div id="start-prompt-lower">
      <a href="/privacy.html">Privacy Policy</a>
    </div>
  </div>
  <!-- START PROMPT END -->
{/if}
