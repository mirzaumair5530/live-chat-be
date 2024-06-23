import { Router } from "express"
import chartRouter from "./chat.router"



const router = Router()

router.use("/chat", chartRouter)

export default router
