import Users from "../../models/dbUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = (req, res) => {
  const { email, password } = req.body;
  // email, password validation
  if (!email || !password) {
    return res.status(422).json({
      error: "One or more fields are empty",
    });
  }
  // Finding user
  Users.findOne({ email })
    .populate({ path: "rooms", select: "name lastMessage" })
    .then((user) => {
      // User not found
      if (!user) {
        return res.status(422).json({
          error: "Invalid Email / Password",
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (matched) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            const { _id, name, email, rooms, image } = user;
            res.json({
              message: "Logged In Successfully",
              token,
              user: { _id, name, email, rooms, image },
            });
          } else {
            return res.status(422).json({
              error: "Invalid Email / Password",
            });
          }
        })
        .catch((err) => console.log(err));
    });
};

export const signup = (req, res) => {
  const { name, email, password } = req.body;
  // email, password, name validation
  if (!name || !email || !password) {
    return res.status(422).json({
      error: "One or more fields are empty",
    });
  }
  Users.findOne({ email })
    .then((usr) => {
      // checking wether user already exists
      if (usr) {
        return res.status(422).json({
          error: "User already exists",
        });
      }
      // creating user
      // 12 -> encryption level
      bcrypt.hash(password, 12).then((hashedPassword) => {
        Users.create({ name, email, password: hashedPassword })
          .then((user) => {
            //generating token
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            const { _id, name, email } = user;
            res.json({
              message: "Signed Up Successfully",
              token,
              user: { _id, name, email },
            });
          })
          .catch((err) => console.log(err));
      });
    })
    .catch((err) => console.log(err));
};

export const addImage = (req, res) => {
  const { _id } = req.user;
  const { url } = req.body;

  Users.findByIdAndUpdate(_id, { image: url }, (err, data) =>
    err ? res.status(500).send(error) : res.status(201).send(data)
  );
};

// export const changeName = (req, res) => {
//   const { _id } = req.user;
//   const { name } = req.body;
//   Users.findByIdAndUpdate(_id, { name: name }, (err, data) =>
//     err ? res.status(500).send(error) : res.status(201).send(data)
//   );
// };
