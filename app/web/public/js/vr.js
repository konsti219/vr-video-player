// TODO: more info in recommended
// TODO: browse recommended
// TODO: more info on video
// TODO: controls & ended
// TODO: night mode



let player = {
  playing: false,
  loaded: false,
  interacted: false,
  videos: [],
  watched: [],
  page: 0,
  nightmode: false
};
let video = document.querySelector("#stream");

const getIcon = (charcode, color, size) => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const fontSize = 800 / (1024 / size);
  const position = size / 2;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.font = fontSize + "px FontAwesome";
  ctx.fillText(String.fromCharCode("0x" + charcode), position, position);

  return canvas.toDataURL();
};

// play functions
const play = () => {
  //video.play();
  control.setAttribute("src", getIcon("f04c", "darkgrey", 128));
  player.playing = true;
};

const pause = () => {
  video.pause();
  control.setAttribute("src", getIcon("f04b", "darkgrey", 128));
  player.playing = false;
};

const change = () => {
  if (player.playing) pause();
  else play();
};

const playStart = () => {
  video.play();
  setTimeout(() => pause(), 100);
};

// LOAD VIDEO
const loadVideo = id => {
  // load via seprate service with seperate proxy
  video.setAttribute(
    "src",
    "https://ytraw.glitch.me/watch?proxy=https://konsti-proxy.herokuapp.com/&v=" +
      id
  );

  // loading screen
  document.querySelector("#loading").setAttribute("position", "0 1.6 -1.4");

  player.loaded = false;

  console.log("loading...");
};
/*
video.addEventListener("loadedmetadata", () => {
  // "remove" loading screen
  document.querySelector("#loading").setAttribute("position", "0 -10000 0");

  player.loaded = true;

  // if selecting a new video autoplay
  if (player.watched.length > 1) play();
  else {
    // only start if user already clicked something
    if (player.interacted) playStart();
  }

  console.log("loaded metadata");
});*/

// RECOMMENDATIONS
const createVideoEntity = (thumbnail, title, creator, id) => {
  let entity = document.createElement("a-entity");
  entity.id = "vid-" + id;
  entity.setAttribute("class", "clickable");
  entity.setAttribute("geometry", "primitive: plane;");
  entity.setAttribute(
    "material",
    "color: black; shader: flat; transparent: true; opacity: 0;"
  );
  entity.onclick = e => {
    console.log(e.target.id);
    loadVideo(e.target.id.substring(4, 15));
  };

  let image = document.createElement("a-image");
  image.setAttribute("src", "https://konsti-proxy.herokuapp.com/" + thumbnail);
  image.setAttribute("height", 0.8);
  image.setAttribute("width", 1.06);
  entity.appendChild(image);

  let titleText = document.createElement("a-entity");
  titleText.setAttribute(
    "text",
    `value: ${title}; width: 1.1; height: 0.8; wrapCount: 16; align: center;`
  );
  titleText.setAttribute("position", "0 0 0.01");
  entity.appendChild(titleText);

  return entity;
};

let watchList = document.querySelector("#watchList");
const showVideoPage = () => {
  watchList.innerHTML = "";

  for (let i = 0; i <= 9; i++) {
    let current = player.videos[player.page * 10 + i];

    let entity = createVideoEntity(
      current.snippet.thumbnails.high.url,
      current.snippet.title,
      current.snippet.channelTitle,
      current.id
    );

    entity.setAttribute(
      "position",
      `${Math.floor(i / 5) * 1.2} ${-i % 5} 0.01`
    );

    watchList.appendChild(entity);
    //console.log(entity);
  }

  document
    .querySelector("#cursor")
    .setAttribute("raycaster", "objects: .clickable");
};

//setTimeout(() => socket.emit("videos", { region: "US", category: 20 }), 1000); // load videos
/*setTimeout(() => {
  if (player.videos.length === 0)
    socket.emit("videos", { region: "US", category: 20 });
}, 10000);*/

/*socket.on("videos", p => {
  console.log(p);
  player.videos = p.videos;
  //showVideoPage();

  //if (player.watched.length === 0) loadVideo(player.videos[0].id);
});*/

// -----------
// BUTTONS

// pause / play
let control = document.querySelector("#controlPlay");
/*control.setAttribute("src", getIcon("f04b", "darkgrey", 128));

control.addEventListener("click", () => {
  change();
});

control.addEventListener("mouseenter", () => {
  control.setAttribute(
    "src",
    getIcon(player.playing ? "f04c" : "f04b", "#ccc", 128)
  );
});
control.addEventListener("mouseleave", () => {
  control.setAttribute(
    "src",
    getIcon(player.playing ? "f04c" : "f04b", "darkgrey", 128)
  );
});

// recommendation browsing
// up
let browseUp = document.querySelector("#browseUp");
browseUp.setAttribute("src", getIcon("f062", "darkgrey", 128));

browseUp.addEventListener("click", () => {
  player.page--;
  if (player.page < 0) player.page = 4;
  showVideoPage();
});

browseUp.addEventListener("mouseenter", () => {
  browseUp.setAttribute("src", getIcon("f062", "#ccc", 128));
});
browseUp.addEventListener("mouseleave", () => {
  browseUp.setAttribute("src", getIcon("f062", "darkgrey", 128));
});

// down
let browseDown = document.querySelector("#browseDown");
browseDown.setAttribute("src", getIcon("f063", "darkgrey", 128));

browseDown.addEventListener("click", () => {
  player.page++;
  if (player.page > 4) player.page = 0;
  showVideoPage();
});

browseDown.addEventListener("mouseenter", () => {
  browseDown.setAttribute("src", getIcon("f063", "#ccc", 128));
});
browseDown.addEventListener("mouseleave", () => {
  browseDown.setAttribute("src", getIcon("f063", "darkgrey", 128));
});*/

var input = "";
function updateInput(e) {
  var code = parseInt(e.detail.code);
  switch (code) {
    case 8:
      input = input.slice(0, -1);
      break;
    case 6:
      alert("submitted");
      var keyboard = document.querySelector("#keyboard");
      document.querySelector("#input").setAttribute("value", input);
      document.querySelector("#input").setAttribute("color", "blue");
      keyboard.parentNode.removeChild(keyboard);
      return;
    default:
      input = input + e.detail.value;
      break;
  }
  document.querySelector("#input").setAttribute("value", input + "_");
}
document.addEventListener("a-keyboard-update", updateInput);

app.loadScene = id => {
  $("#scene-content").empty();

  let sceneContent = $("#scene-content");
  let template = $(id)[0];
  console.log(template)

  let clone = template.content.cloneNode(true);

  sceneContent.append(clone);
};
