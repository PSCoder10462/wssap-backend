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
// dp
// name
// last message : timestamp
// id

// Users.findById().populate("rooms");
// Rooms.findById(user?.room?._id).populate;
// export const getRoom = (req, res) => {

// }

// get request -> data -> state - data (show)
// post request -> if successful -> state update (push data)
// state -> real TimeRange
// refresh -> data fetch
