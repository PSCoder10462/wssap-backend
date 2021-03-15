import Messages from "../../models/dbMessages.js";

export const newMessage = (req, res) => {
  {
    const user = req.user;
    const message = req.body;
    const m = {
      ...message,
      name: user.name,
      user: user._id,
    };

    Messages.create(m, (err, data) => {
      // status code
      // 201 -> create successful
      // 500 -> internal server error
      err ? res.status(500).send(err) : res.status(201).send(data);
    });
  }
};

export const syncMessages = (req, res) => {
  // field to be populated inside message
  Messages.find()
    .populate("user")
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => res.status(500).send(err));
};
