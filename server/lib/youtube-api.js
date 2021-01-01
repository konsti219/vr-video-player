const fetch = require("node-fetch");

const validRegions = ["US", "DE"];
const validCategorys = [
  1,
  2,
  10,
  15,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44
];

let cache = {};
const getVideos = async (region, category) => {
  let id = region + category;

  let p = new Promise(async (resolve, reject) => {
    if (!validRegions.includes(region)) {
      reject();
      return;
    }
    if (!validCategorys.includes(category)) {
      reject();
      return;
    }

    // check if still fresh
    if (!cache[id] || cache[id].updated + 60000 < Date.now()) {
      //console.log("fetching for new...");
      let res = await fetch(
        `https://content.googleapis.com/youtube/v3/videos?chart=mostPopular&part=snippet%2CcontentDetails%2Cstatistics&regionCode=${region}&videoCategoryId=${category}&maxResults=50&key=${process.env.YOUTUBE_API_KEY}`
      );
      const data = await res.json();

      cache[id] = { videos: data.items, updated: Date.now() };
    }

    resolve(cache[id].videos);
  });
  return p;
};

module.exports = { getVideos };
