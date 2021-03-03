// importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";
import { pusher_keys, CONNECTION_URL } from "./keys.js";

// app config
const app = express(),
  port = process.env.PORT || 5000;

const pusher = new Pusher(pusher_keys);

// middleware
app.use(express.json());
app.use(cors());
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
};

db.on("error", (error) => console.log("❌ MongoDB:", error)); // listen for errors after the connection is established (errors during the session)
db.on("disconnected", () => console.log("❌ MongoDB disconnected"));

db.once("open", () => {
  console.log("✅ MongoDB connected");

  // this collection must be same as one named in dbMessages model
  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    // console.log(change);
    console.log("yoo1");

    switch (change.operationType) {
      case "insert":
        console.log("yoo2");
        const messageDetails = change.fullDocument;
        pusher.trigger("messages", "inserted", {
          name: messageDetails.name,
          message: messageDetails.message,
          timestamp: messageDetails.timestamp,
          received: messageDetails.received,
        });
        console.log("yoo3");
        break;
      default:
        console.log("❌ Error occured in Pusher");
        break;
    }
  });
});

// connect to db
mongoose
  .connect(CONNECTION_URL, DEPRECATED_FIX)
  .catch((error) => console.log("❌ MongoDB:", error));

// its magic??

// api routes
app.get("/", (req, res) => {
  // status code
  // 200 -> ok
  res.status(200).send("hello world of express");
});

app.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    err ? res.status(500).send(err) : res.status(200).send(data);
  });
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    // status code
    // 201 -> create successful
    // 500 -> internal server error
    err ? res.status(500).send(err) : res.status(201).send(data);
  });
});

// listener
app.listen(port, () => {
  console.log("listening at: http://localhost:" + port);
});
