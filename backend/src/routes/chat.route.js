import express from "express";
import { getStreamToken, getPublicChannelsController, joinPublicChannel } from "../controllers/chat.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);
router.get("/public-channels", protectRoute, getPublicChannelsController);
router.post("/join", protectRoute, joinPublicChannel);

export default router;