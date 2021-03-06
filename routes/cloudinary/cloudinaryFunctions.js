import { v2 as cloudinary } from "cloudinary";

export const signature = (req, res) => {
  try {
    const signature = cloudinary.utils.api_sign_request(
      req.body.params_to_sign,
      process.env.CLOUDINARY_SECRET
    );
    res.json({ signature, timestamp: req.body.params_to_sign.timestamp });
  } catch (error) {
    console.log(error);
  }
};

export const deleteImage = (req, res) => {
  const { path } = req.body;
  cloudinary.uploader
    .destroy(`whatsapp-mern/${path}`, {
      api_key: process.env.API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
      cloud_name: "pscoder10462",
    })
    .then((data) => res.send("Picture deleted successfully!!"))
    .catch((err) => console.log(err));
};
