import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_SECRET } from "../../keys.js";

export const signature = (req, res) => {
  try {
    const signature = cloudinary.utils.api_sign_request(
      req.body.params_to_sign,
      CLOUDINARY_SECRET
    );
    res.json({ signature, timestamp: req.body.params_to_sign.timestamp });
  } catch (error) {
    console.log(error);
  }
};
