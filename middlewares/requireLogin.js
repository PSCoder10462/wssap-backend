import { JWT_SECRET } from "../keys.js";
import jwt from "jsonwebtoken";
import User from "../models/dbUser.js";

// authorization: "Bearer {token}"

const requireLogin = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      error: "You must be Logged In",
    });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    const { _id } = payload;
    User.findById(_id).then((userData) => {
      const { _id, name, email } = userData;
      req.user = { _id, name, email };
      next();
    });
  });
};

export default requireLogin;
