import express from "express";
import { signature } from "./cloudinaryFunctions.js";
import requireLogin from "../../middlewares/requireLogin.js";

const router = express.Router();

router.post("/signature", requireLogin, signature);

export default router;
