// NEDB DATABASE

// LIBS
const Datastore = require("nedb-promises");
const fs = require("fs");

const initDatabase = async (path) => {
  if (!fs.existsSync("./.data/users.db")) {
    fs.mkdirSync("./.data");
    fs.writeFileSync("./.data/users.sb", "");
  }

  const db = Datastore.create({
    filename: path,
    autoload: true,
  });

  db.ensureIndex({ fieldName: "id", unique: true });
  db.ensureIndex({ fieldName: "googleId", unique: true });
  db.ensureIndex({ fieldName: "friendCode", unique: true });

  // dev db wiper
  // await db.remove({}, { multi: true });

  console.log(await db.find({}));

  return db;
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
        owner: "<owner id>",
        id: "<group id>"
      }
    ],
    roomsOwned: [
      {
        id: "",
        name: "",
        members: [
          {
            id: "",
            role: "member/moderator/owner"
          }
        ],
        permisssions: {
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
    ],
    friends: [
      "<friend's id>"
    ]
  }
]


*/
