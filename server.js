// importing
import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { pusher_keys, CONNECTION_URL } from "./keys.js";
import IMPORTED_ROUTES_AUTH from "./routes/auth/authRoutes.js";
import IMPORTED_ROUTES_ROOMS from "./routes/rooms/roomsRoutes.js";

// app config
const app = express(),
  port = process.env.PORT || 5000;

const pusher = new Pusher(pusher_keys);

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
  // const msgCollection = db.collection("messagecontents");
  // const changeStream = msgCollection.watch();

  // changeStream.on("change", (change) => {
  //   // console.log(change);

  //   switch (change.operationType) {
  //     case "insert":
  //       const messageDetails = change.fullDocument;
  //       pusher.trigger("messages", "inserted", {
  //         name: messageDetails.name,
  //         message: messageDetails.message,
  //         timestamp: messageDetails.timestamp,
  //         received: messageDetails.received,
  //       });
  //       break;
  //     default:
  //       console.log("❌ Error occured in Pusher");
  //       break;
  //   }
  // });
});

// connect to db
mongoose
  .connect(CONNECTION_URL, DEPRECATED_FIX)
  .catch((error) => console.log("❌ MongoDB:", error));

// api routes
app.use("/auth", IMPORTED_ROUTES_AUTH);
app.use("/rooms", IMPORTED_ROUTES_ROOMS);

// listener
app.listen(port, () => {
  console.log("listening at: http://localhost:" + port);
});
