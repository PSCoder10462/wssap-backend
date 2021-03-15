import express from "express";
import { newMessage, syncMessages } from "./messagesFuntions.js";
import requireLogin from "../../middlewares/requireLogin.js";

const router = express.Router();

router.post("/new", requireLogin, newMessage);
router.get("/sync", syncMessages);

export default router;
