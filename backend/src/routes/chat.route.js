import express from "express";
import { getStreamToken, getPublicChannelsController } from "../controllers/chat.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);
router.get("/public-channels", protectRoute, getPublicChannelsController);

export default router;