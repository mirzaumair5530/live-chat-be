import { Router } from "express";

import chartRouter from "./chat.router";
import { Authentication } from "../authentication";

const router = Router();

router.use("/chat", Authentication.isAuthenticated, chartRouter);

export default router;
