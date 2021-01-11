// NEDB DATABASE

// LIBS
const Datastore = require("nedb-promises");
const fs = require("fs");
const path = require("path");

const prod = process.env.NODE_ENV == "production";

const makeFiles = (filePath) => {
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath));
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
  }
};

const initDatabase = async (usersPath, roomsPath) => {
  makeFiles(usersPath);
  makeFiles(roomsPath);

  const db = Datastore.create({
    filename: usersPath,
    autoload: true,
  });
  db.ensureIndex({ fieldName: "id", unique: true });
  db.ensureIndex({ fieldName: "googleId", unique: true });
  db.ensureIndex({ fieldName: "friendCode", unique: true });

  // dev db wiper
  // await db.remove({}, { multi: true });

  const roomsDb = Datastore.create({
    filename: roomsPath,
    autoload: true,
  });
  roomsDb.ensureIndex({ fieldName: "id", unique: true });
  roomsDb.ensureIndex({ fieldName: "roomCode", unique: true });

  if (!prod) {
    console.log(await db.find({}));
    console.log(await roomsDb.find({}));
  }

  return { db, roomsDb };
};

module.exports = initDatabase;

/*
DB STRUCTURE

users [
  {
    id: "<user id>",
    googleId: "",
    token: "",
    friendCode: "",
    name: "",
    rooms: [
      { 
        id: "<room id>",
        personal: true
      }
    ],
    friends: [
      "<friend's id>"
    ]
  }
]

rooms [
  {
    id: "",
    name: "",
    roomCode: "AAAAAA",
    members: [
      {
        id: "",
        role: "member/moderator/owner"
      }
    ],
    permissions: {
      join: "anyone",
      speak: "member/moderator/owner",
      hear: "member",
      suggestVideo: "member",
      controlVideo: "moderator",
      selectVideo: "moderator",
      kick: "moderator",
      ban: "owner",
      manage: "owner"
    },
    public: false,
    personal: true
  }
]

*/
