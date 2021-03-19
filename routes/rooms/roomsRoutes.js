import { Router } from "express";
import {
  activateRoom,
  addImage,
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
router.post("/addImage", requireLogin, addImage);

export default router;
