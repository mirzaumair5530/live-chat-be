import { Router } from "express";
import * as chatController from "../../controllers/chat.controller";

const router = Router();

router.get("/all-active-users", chatController.getActiveUsers);

export default router;
