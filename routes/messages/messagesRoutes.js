import express from "express";
import { newMessage, syncMessages } from "./messagesFuntions.js";

const router = express.Router();

router.post("/new", newMessage);
router.get("/sync", syncMessages);

export default router;
