import Messages from "../../models/dbMessages.js";

export const newMessage = (req, res) => {
  {
    const message = req.body;
    Messages.create(message, (err, data) => {
      // status code
      // 201 -> create successful
      // 500 -> internal server error
      err ? res.status(500).send(err) : res.status(201).send(data);
    });
  }
};

export const syncMessages = (req, res) => {
  Messages.find((err, data) => {
    err ? res.status(500).send(err) : res.status(200).send(data);
  });
};
