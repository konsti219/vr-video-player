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
  nightmode: false,
};

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
  entity.onclick = (e) => {
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
/*
// recommendation browsing
// up
let browseUp = document.querySelector("#browseUp");
browseUp.setAttribute("src", getIcon("f062", "darkgrey", 128));

browseUp.addEventListener("click", () => {
  player.page--;
  if (player.page < 0) player.page = 4;
  showVideoPage();
});

// down
let browseDown = document.querySelector("#browseDown");
browseDown.setAttribute("src", getIcon("f063", "darkgrey", 128));

browseDown.addEventListener("click", () => {
  player.page++;
  if (player.page > 4) player.page = 0;
  showVideoPage();
});
*/
