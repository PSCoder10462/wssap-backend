import Rooms from "../../models/dbRoom.js";
import Users from "../../models/dbUser.js";

export const createRoom = (req, res) => {
  const user = req.user;
  Rooms.create({ name: req.body.roomName }, (err, data) => {
    if (err) res.status(500).send(err);
    else {
      Users.findByIdAndUpdate(
        user._id,
        { $addToSet: { rooms: data._id } },
        (error, doc) =>
          error ? res.status(500).send(error) : res.status(201).send(doc)
      );
    }
  });
};

export const getRooms = (req, res) => {
  const user = req.user;
  Users.findById(user._id)
    .populate({ path: "rooms", select: "name lastMessage" })
    .then((user) => {
      res.send(user.rooms);
    })
    .catch((err) => console.log(err));
};

export const joinRoom = (req, res) => {
  const { user } = req;
  const id = req.body.id;
  Rooms.findById(id)
    .then((doc) => {
      if (doc) {
        Users.findByIdAndUpdate(
          user._id,
          { $addToSet: { rooms: doc._id } },
          (error, data) =>
            error ? res.status(500).send(error) : res.status(201).send(data)
        );
      } else {
        console.log("Room Not Found!");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const activateRoom = (req, res) => {
  const id = req.headers.id;

  Rooms.findById(id)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => console.log(err.message));
};

export const addMessage = (req, res) => {
  const id = req.body.id;
  const m = req.body.message;
  const { name, message, timestamp } = m;
  Rooms.findByIdAndUpdate(
    id,
    { $push: { messages: m }, lastMessage: { name, message, timestamp } },
    (err, data) =>
      err ? res.status(500).send(error) : res.status(201).send(data)
  );
};

export const addImage = (req, res) => {
  const { id, url } = req.body;
  Rooms.findByIdAndUpdate(id, { image: url }),
    (err, data) =>
      err ? res.status(500).send(error) : res.status(201).send(data);
};
