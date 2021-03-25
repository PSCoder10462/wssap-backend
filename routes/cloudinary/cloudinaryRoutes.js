import express from "express";
import { signature, deleteImage } from "./cloudinaryFunctions.js";
import requireLogin from "../../middlewares/requireLogin.js";

const router = express.Router();

router.post("/signature", requireLogin, signature);
router.delete("/image", requireLogin, deleteImage);

export default router;
