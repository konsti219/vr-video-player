let app = {
  isMobile: false,
  readyFullscreen: false,
  setPrompt: id => {
    $("#start-prompt-content")
      .children()
      .css("display", "none");
    $(id).css("display", "block");
    $("#start-prompt").css("display", "block");
  },
  loggedIn: false,
  novr: false,
  socketReady: false,
  inGame: false
};

// check device info
try {
  document.createEvent("TouchEvent");
  app.isMobile = true;
} catch (e) {}
app.novr = new URL(location.href).searchParams.get("novr") === "true";

// transfer cookie to ls, because setting cookies on server is easier
const getCookie = cookie => {
  const val = document.cookie
    .split("; ")
    .find(row => row.split("=")[0] === cookie);
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

  if (document.fullscreenElement || app.novr) {
    app.setPrompt("#start-prompt-enter");
    if (app.inGame) $("#start-prompt").css("display", "none");
  } else {
    app.setPrompt("#start-prompt-fullscreen");
  }

  // render enter prompt
  if (app.account) {
    $("#prompt-user-name").text(
      app.account.name === "[NEW]" ? "" : ", " + app.account.name
    );
  }
};
$(window).on("resize", e => stateChange());
$(document).on("fullscreenchange", e => stateChange());

$("#start-prompt").on("click", e => {
  if (app.readyFullscreen && !app.novr && !document.fullScreenElement) {
    $("#container")[0].requestFullscreen();
  }
});

$("#start-prompt-enter-button").on("click", () => {
  app.inGame = true;
  stateChange();
});
