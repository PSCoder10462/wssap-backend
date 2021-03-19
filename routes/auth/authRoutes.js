import express from "express";
import requireLogin from "../../middlewares/requireLogin.js";
import { login, signup, addImage } from "./authFunctions.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/addImage", requireLogin, addImage);
// router.post("/changeName", requireLogin, changeName);

export default router;
