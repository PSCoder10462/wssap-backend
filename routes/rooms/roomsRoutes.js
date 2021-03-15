import { Router } from "express";
import { createRoom, getRooms, joinRoom } from "./roomsFunctions.js";
import requireLogin from "../../middlewares/requireLogin.js";

const router = Router();

router.post("/createRoom", requireLogin, createRoom);
router.get("/getRoom", requireLogin, getRooms);
router.post("/joinRoom", requireLogin, joinRoom);

export default router;
