// importing
import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import IMPORTED_ROUTES_AUTH from "./routes/auth/authRoutes.js";
import IMPORTED_ROUTES_ROOMS from "./routes/rooms/roomsRoutes.js";
import IMPORTED_ROUTES_CLOUDINARY from "./routes/cloudinary/cloudinaryRoutes.js";

// app config
const app = express(),
  port = process.env.PORT || 5000;

dotenv.config();

const pusher = new Pusher({
  appId: process.env.Pusher_appId,
  key: process.env.Pusher_key,
  secret: process.env.Pusher_secret,
  cluster: process.env.Pusher_cluster,
  useTLS: process.env.Pusher_useTLS,
});

// middleware
app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: "thisismeps",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: "auto" },
  })
);

app.use(passport.initialize());
app.use(passport.session());
// securing msg, currently allowing from everyone
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Header", "*");
//   next();
// });

// db config
const db = mongoose.connection;

const DEPRECATED_FIX = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

db.on("error", (error) => console.log("❌ MongoDB:", error)); // listen for errors after the connection is established (errors during the session)
db.on("disconnected", () => console.log("❌ MongoDB disconnected"));

db.once("open", () => {
  console.log("✅ MongoDB connected");

  // this collection must be same as one named in dbMessages model
  const userCollection = db.collection("users");
  const userStream = userCollection.watch({ fullDocument: "updateLookup" });
  const roomCollection = db.collection("rooms");
  const roomStream = roomCollection.watch({ fullDocument: "updateLookup" });

  userStream.on("change", (change) => {
    switch (change.operationType) {
      case "update":
        const user = change.fullDocument;
        pusher.trigger("user", "updated", {
          user,
        });
        break;
      default:
        console.log("❌ Error occured in Pusher");
        break;
    }
  });
  roomStream.on("change", (change) => {
    switch (change.operationType) {
      case "update":
        const room = change.fullDocument;
        pusher.trigger("room", "updated", {
          room,
        });
        break;
      default:
        console.log("❌ Error occured in Pusher");
        break;
    }
  });
});

// connect to db
mongoose
  .connect(process.env.CONNECTION_URL, DEPRECATED_FIX)
  .catch((error) => console.log("❌ MongoDB:", error));

// api routes
app.use("/auth", IMPORTED_ROUTES_AUTH);
app.use("/rooms", IMPORTED_ROUTES_ROOMS);
app.use("/cloudinary", IMPORTED_ROUTES_CLOUDINARY);

// home
app.get("/", (_req, res) => {
  res.send("henlo");
});

// listener
app.listen(port, () => {
  console.log("listening at: http://localhost:" + port);
});
