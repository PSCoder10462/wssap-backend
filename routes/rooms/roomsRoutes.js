import { Router } from "express";
import {
  activateRoom,
  addMessage,
  createRoom,
  getRooms,
  joinRoom,
} from "./roomsFunctions.js";
import requireLogin from "../../middlewares/requireLogin.js";

const router = Router();

router.post("/createRoom", requireLogin, createRoom);
router.get("/getRoom", requireLogin, getRooms);
router.post("/joinRoom", requireLogin, joinRoom);
router.get("/activateRoom", requireLogin, activateRoom);
router.post("/addMessage", requireLogin, addMessage);

export default router;
