import express from "express"
import { protectedroute } from "../middleware/auth.js"
import { getstreamtoken } from "../controllers/chat.js"
const router = express.Router()
// Additional route handlers would go here

router.use(protectedroute)

router.get("/token",getstreamtoken)



export default router;

